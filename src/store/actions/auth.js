import firebase from "react-native-firebase";
import { USER_DETAILS } from "../constants";

// action creator for authDetails for the phone authentication
// response from sign in after code is sent
export const setUserDetails = userDetails => {
  return {
    type: USER_DETAILS,
    payload: userDetails
  };
};

export const createAccount = (username, pictureUri) => async dispatch => {
  //upload picture to firebase storage
  let user = firebase.auth().currentUser;
  await firebase
    .storage()
    .ref(`images/profile_pictures/${new Date().getTime()}`)
    .put(pictureUri)
    .then(snapshot => {
      if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
        user
          .updateProfile({
            displayName: username,
            photoURL: snapshot.downloadURL
          })
          .then(() => {
            user = firebase.auth().currentUser;
            dispatch(setUserDetails(user));
            dispatch(userDetailsToDatabase(user));
          });
      }
    })
    .catch(err => {
      console.log(err.message);
    });
};

const userDetailsToDatabase = user => async dispatch => {
  //add new user to firestore
  await firebase
    .database()
    .ref(`users/${user._user.uid}`)
    .set(user);
};
