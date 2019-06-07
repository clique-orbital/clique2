import firebase from "react-native-firebase";
import uuidv4 from "uuid/v4";
const db = firebase.database();

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
  users,
  data
) => async () => {
  const newGroup = {
    groupName,
    last_message: {
      data,
      image: "",
      timestamp: new Date().getTime(),
      user_id: "",
      video: ""
    },
    users
  };

  await firebase
    .database()
    .ref(`groups`)
    .child(groupID)
    .set(newGroup)
    .catch(err => console.log(err));
};

export const createGroup = (
  groupName,
  user,
  data,
  users = []
) => async dispatch => {
  let users_info = { [user]: true };
  const groupID = uuidv4();

  addGroupToUser(groupID, user);

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

  await dispatch(newGroupCreator(groupName, groupID, users_info, data));
};
