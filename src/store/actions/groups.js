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
import { removeGroupEvents } from "./calendar";
import { removeGroupMessages } from "./messages";
import ImageResizer from 'react-native-image-resizer';

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

const addGroupPicture = async (pictureUri, groupID) => {
  return ImageResizer.createResizedImage(pictureUri, 400, 300, 'JPEG', 80)
    .then(({ uri }) => {
      return firebase
        .storage()
        .ref(`images/group_pictures/${groupID}.jpeg`)
        .put(uri)
        .then(snapshot => {
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            return snapshot.downloadURL;
          }
        })
        .catch(err => {
          console.log("Add group picture error:", err.message);
        });
    })
};

export const editGroup = (groupID, groupName, groupPicture) => async dispatch => {
  const url = await addGroupPicture(groupPicture, groupID);
  await db.ref(`groups/${groupID}/groupName`).set(groupName);
  await db.ref(`groups/${groupID}/photoURL`).set(url);
  const groupSnapshot = await db.ref(`groups/${groupID}`).once("value");
  const group = groupSnapshot.val();
  dispatch(addNewGroup(groupID, group));
  return group;
  // db.ref(`groups/${groupID}`).once("value", snapshot => {
  //   dispatch(addNewGroup(groupID, snapshot.val()))
  // })
}

export const createGroup = (
  groupName,
  groupPicture,
  filetype,
  myuser,
  myDisplayName,
  data,
  users = []
) => async dispatch => {
  let users_info = { [myuser]: myDisplayName };
  const groupID = uuidv4();
  for (let user of users) {
    users_info = { ...users_info, [user.uid]: user.displayName };
  }

  const url = await addGroupPicture(groupPicture, groupID);
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
          addGroupToUser(groupID, user.uid);
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

export const removeUser = (uid, groupID, leave) => async dispatch => {
  return db
    .ref(`users/${uid}/groups/${groupID}`)
    .remove()
    .then(() => {
      if (!leave) dispatch(removeUserFromGroupInStore(uid, groupID));
      return db.ref(`groups/${groupID}/users/${uid}`).remove();
    });
};

export const deleteGroupFromDb = (groupID, users) => async dispatch => {
  users = _.keys(users).map(uid => {
    const userAttendingPromise = db.ref(`users/${uid}/attending/${groupID}`).remove();
    const userNotAttendingPromise = db.ref(`users/${uid}/notAttending/${groupID}`).remove();
    const userGroupPromise = db.ref(`users/${uid}/groups/${groupID}`).remove();
    return [userAttendingPromise, userGroupPromise, userNotAttendingPromise];
  });
  Promise.all(_.flatten(users))
    .then(async () => {
      await db.ref(`events/${groupID}`).remove();
      await db.ref(`messages/${groupID}`).remove();
      await db.ref(`groups/${groupID}`).remove();
    })
    .then(() => {
      dispatch(removeGroupEvents(groupID));
      dispatch(removeGroupMessages(groupID));
    })
    .then(async () => {
      const ref = await firebase.storage().ref(`images/group_pictures/${groupID}.jpeg`);
      console.log(ref);
      ref.delete();
    })
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
