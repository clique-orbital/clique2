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
  photoURL,
  users,
  data
) => async () => {
  const newGroup = {
    groupName,
    photoURL,
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

const addGroupPicture = pictureUri => async () => {
  //upload picture to firebase storage
  let url;
  await firebase
    .storage()
    .ref(`images/group_pictures/${new Date().getTime()}`)
    .put(pictureUri)
    .then(snapshot => {
      if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
        url = snapshot.downloadURL;
      }
    })
    .catch(err => {
      console.log(err.message);
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
};
