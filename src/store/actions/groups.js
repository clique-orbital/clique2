import firebase from "react-native-firebase";
import uuidv4 from "uuid/v4";
import {
  INITIALIZE_GROUPS,
  ADD_NEW_GROUP,
  FETCH_GROUP,
  SORT_GROUPS
} from "../constants";
import _ from "lodash";

const db = firebase.database();

export const sortGroups = () => {
  return { type: SORT_GROUPS };
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
  Promise.all(
    groupIDs.map(async groupID => {
      const data = await firebase
        .database()
        .ref(`groups/${groupID}`)
        .once("value");
      groups[groupID] = data.val();
    })
  )
    .then(() => dispatch(fetchedGroups(groups)))
    .then(() => dispatch(sortGroups()));
  return Promise.resolve();
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
    .ref(`images/group_pictures/${new Date().getTime()}`)
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
  myuser,
  data,
  users = []
) => async dispatch => {
  let users_info = { [myuser]: true };
  const groupID = uuidv4();
  addGroupToUser(groupID, myuser);
  for (let user of users) {
    db.ref("phoneNumbers")
      .child(`${user.phoneNumbers[0].number.replace(/\s/g, "")}`)
      .once("value", data => {
        uid = data.child("uid").val();
        users_info = { ...users_info, [uid]: true };
        addGroupToUser(groupID, uid);
      });
  }

  const url = await addGroupPicture(groupPicture);
  newGroupCreator(groupName, groupID, url, users_info, data).then(() => {
    return db
      .ref("groups")
      .child(`${groupID}`)
      .once("value")
      .then(snapshot => {
        const newGroup = snapshot.val();
        dispatch(addNewGroup(groupID, newGroup));
        return true;
      })
      .catch(e => console.log(e));
  });
};
