import firebase from "react-native-firebase";
import { USER_DETAILS, UPDATE_USER } from "../constants";

// action creator for authDetails for the phone authentication
// response from sign in after code is sent
export const setUserDetails = userDetails => {
  return {
    type: USER_DETAILS,
    payload: userDetails
  };
};

export const updateUser = (username, pictureUrl) => {
  return {
    type: UPDATE_USER,
    payload: { username, pictureUrl }
  };
};

export const createAccount = (username, pictureUri) => dispatch => {
  firebase
    .storage()
    .ref(`images/profile_pictures/${new Date().getTime()}`)
    .put(pictureUri)
    .then(snapshot => {
      if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
        console.log(snapshot);
        dispatch(userDetailsToDatabase(username, snapshot.downloadURL));
        dispatch(updateUser(username, snapshot.downloadURL));
      }
    })
    .catch(err => {
      console.log(err.message);
    });
};

const userDetailsToDatabase = (username, pictureUrl) => async (
  dispatch,
  getState
) => {
  const uid = getState().authReducer.user.uid;
  await firebase
    .database()
    .ref("users")
    .push(uid);
  firebase
    .database()
    .ref(`users/${uid}`)
    .set({ username, pictureUrl });
};
