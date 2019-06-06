import firebase from "react-native-firebase";

export const createGroup = (groupName, users) => async dispatch => {
  const users_info = {};
  users.map(user => (users_info[user.uid] = true));
  const newGroup = {
    groupName,
    last_message: {
      data: "",
      image: "",
      timestamp: "",
      user_id: "",
      video: ""
    },
    users_info
  };

  await firebase
    .database()
    .ref(`groups`)
    .push(newGroup)
    .then(res => {
      const path = res.path;
      for (let user in users) {
        firebase
          .database()
          .ref(`users/${user.uid}`)
          .child("groups")
          .set({ [path]: true });
      }
    });
};
