import firebase from "react-native-firebase";
import uuidv4 from "uuid/v4";
import {
  INITIALIZE_GROUPS,
  REMOVE_GROUP,
  ADD_NEW_GROUP,
  FETCH_GROUP,
  SORT_GROUPS,
  REMOVE_USER_FROM_GROUP_REDUX,
  ADD_MEMBER_TO_GROUP
} from "../constants";
import _ from "lodash";

const db = firebase.database();

export const sortGroups = () => {
  return { type: SORT_GROUPS };
};

export const removeGroup = groupID => {
  return { type: REMOVE_GROUP, payload: groupID };
};

export const fetchedGroups = groups => {
  return {
    type: INITIALIZE_GROUPS,
    payload: groups
  };
};

export const fetchAGroup = (groupId, message) => {
  return {
    type: FETCH_GROUP,
    payload: { groupId, message }
  };
};

const addNewGroup = (groupId, group) => {
  return {
    type: ADD_NEW_GROUP,
    payload: { groupId, group }
  };
};

export const fetchGroups = () => async dispatch => {
  const userUID = firebase.auth().currentUser._user.uid;
  const snapshot = await db
    .ref(`users/${userUID}/groups`)
    .once("value")
    .catch(err => console.log(err));
  const groupIDs = _.keys(snapshot.val());
  const groups = {};
  return Promise.all(
    groupIDs.map(async groupID => {
      const data = await db.ref(`groups/${groupID}`).once("value");
      groups[groupID] = data.val();
    })
  )
    .then(() => dispatch(fetchedGroups(groups)))
    .then(() => dispatch(sortGroups()))
    .then(() => groups);
};

export const addGroupToUser = async (groupID, uid) => {
  return db
    .ref(`users/${uid}/groups`)
    .child(groupID)
    .set(true)
    .catch(err => console.log(err));
};

const newGroupCreator = async (groupName, groupID, photoURL, users, data) => {
  const newGroup = {
    groupName,
    photoURL,
    last_message: {
      message: data,
      sender: "",
      timestamp: new Date().getTime(),
      messageType: "text"
    },
    users,
    groupID
  };

  return db
    .ref(`groups`)
    .child(groupID)
    .set(newGroup)
    .catch(err => console.log(err));
};

const addGroupPicture = async pictureUri => {
  return firebase
    .storage()
    .ref(`images/group_pictures/${new Date().getTime()}.jpeg`)
    .put(pictureUri)
    .then(snapshot => {
      if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
        return snapshot.downloadURL;
      }
    })
    .catch(err => {
      console.log("Add group picture error:", err.message);
    });
};

export const createGroup = (
  groupName,
  groupPicture,
  filetype,
  myuser,
  data,
  users = []
) => async dispatch => {
  let users_info = { [myuser]: true };
  const groupID = uuidv4();
  for (let user of users) {
    db.ref("phoneNumbers")
      .child(`${user.phoneNumbers[0].number.replace(/\s/g, "")}`)
      .once("value", data => {
        uid = data.child("uid").val();
        users_info = { ...users_info, [uid]: true };
      });
  }

  const url = await addGroupPicture(groupPicture, filetype);
  newGroupCreator(groupName, groupID, url, users_info, data).then(() => {
    return db
      .ref("groups")
      .child(`${groupID}`)
      .once("value")
      .then(snapshot => {
        const newGroup = snapshot.val();
        dispatch(addNewGroup(groupID, newGroup));
        dispatch(sortGroups());
      })
      .catch(e => console.log(e))
      .then(() => {
        for (let user of users) {
          db.ref("phoneNumbers")
            .child(`${user.phoneNumbers[0].number.replace(/\s/g, "")}`)
            .once("value", data => {
              addGroupToUser(groupID, uid);
            });
        }
      })
      .then(() => {
        addGroupToUser(groupID, myuser);
        return true;
      });
  });
};

const removeUserFromGroupInStore = (uid, groupID) => {
  return { type: REMOVE_USER_FROM_GROUP_REDUX, payload: { uid, groupID } };
};

export const removeUser = (uid, groupID) => async dispatch => {
  return db
    .ref(`users/${uid}/groups/${groupID}`)
    .remove()
    .then(() => {
      dispatch(removeUserFromGroupInStore(uid, groupID));
      return db.ref(`groups/${groupID}/users/${uid}`).remove();
    });
};

export const deleteGroupFromDb = async (groupID, users) => {
  users = _.keys(users).map(uid => {
    return db.ref(`users/${uid}/groups/${groupID}`).remove();
  });
  Promise.all(users).then(async () => {
    await db.ref(`events/${groupID}`).remove();
    await db.ref(`messages/${groupID}`).remove();
    await db.ref(`groups/${groupID}`).remove();
  });
};

const addMemberToGroup = (uid, groupID) => {
  return { type: ADD_MEMBER_TO_GROUP, payload: { uid, groupID } };
};

const addMemberToGroupDB = (uid, groupID) => {
  return db
    .ref(`groups/${groupID}/users/`)
    .child(uid)
    .set(true);
};

export const addMembers = (users, groupID) => async dispatch => {
  let promises = [];
  for (let uid in users) {
    promises.push(
      addMemberToGroupDB(uid, groupID)
        .then(() => addGroupToUser(groupID, uid))
        .then(() => dispatch(addMemberToGroup(uid, groupID)))
    );
  }
  return Promise.all(promises);
};
