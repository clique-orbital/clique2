import firebase from "react-native-firebase";
import { USER_DETAILS } from "../constants";
import { createGroup } from "./groups";

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
  const uid = user._user.uid;
  await firebase
    .database()
    .ref(`users/${uid}`)
    .set(user2);
  await firebase
    .database()
    .ref(`phoneNumbers/${user._user.phoneNumber}`)
    .set(user2);
  createGroup("Saved Messages", uid, "This is your saved messages!");
};
