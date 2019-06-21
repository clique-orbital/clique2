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
  const snapshot = await firebase
    .database()
    .ref(`users/${userUID}/groups`)
    .once("value");
  const groupIDs = _.keys(snapshot.val());
  const groups = {};
  await Promise.all(
    groupIDs.map(async groupID => {
      const data = await firebase
        .database()
        .ref(`groups/${groupID}`)
        .once("value");
      groups[groupID] = data.val();
    })
  );
  dispatch(fetchedGroups(groups));
  dispatch(sortGroups());
};

export const addGroupToUser = (groupID, uid) => async () => {
  await db
    .ref(`users/${uid}/groups`)
    .child(groupID)
    .set(true)
    .catch(err => console.log(err));
};

export const newGroupCreator = (
  groupName,
  groupID,
  photoURL,
  users,
  data
) => async () => {
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

  await firebase
    .database()
    .ref(`groups`)
    .child(groupID)
    .set(newGroup)
    .catch(err => console.log(err));
};

const addGroupPicture = pictureUri => async () => {
  //upload picture to firebase storage
  console.log("picture is uploading");
  let url;
  await firebase
    .storage()
    .ref(`images/group_pictures/${new Date().getTime()}`)
    .put(pictureUri)
    .then(snapshot => {
      if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
        url = snapshot.downloadURL;
        console.log("picture uploaded");
      }
    })
    .catch(err => {
      console.log("error message", err.message);
    });
  return url;
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
  await dispatch(addGroupToUser(groupID, myuser));
  for (let user of users) {
    await db
      .ref("phoneNumbers")
      .child(`${user.phoneNumbers[0].number.replace(/\s/g, "")}`)
      .once("value", async data => {
        uid = data.child("uid").val();
        users_info = { ...users_info, [uid]: true };
        await dispatch(addGroupToUser(groupID, uid));
      });
  }

  const url = await dispatch(addGroupPicture(groupPicture));

  await dispatch(newGroupCreator(groupName, groupID, url, users_info, data));

  db.ref("groups")
    .child(`${groupID}`)
    .once("value")
    .then(snapshot => {
      const newGroup = snapshot.val();
      dispatch(addNewGroup(groupID, newGroup));
    })
    .catch(e => console.log(e));
};
