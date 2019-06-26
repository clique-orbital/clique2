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

export const createAccount = (username, pictureUri, fileType) => dispatch => {
  //upload picture to firebase storage
  let user = firebase.auth().currentUser;
  firebase
    .storage()
    .ref(`images/profile_pictures/${new Date().getTime()}.jpeg`)
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
            user["_user"]["groups"] = "";
            userDetailsToDatabase(user).then(() =>
              dispatch(setUserDetails(user))
            );
          });
      }
    })
    .catch(err => {
      console.log(err.message);
    });
};

const userDetailsToDatabase = async user => {
  const uid = user._user.uid;
  firebase
    .database()
    .ref(`users/${uid}`)
    .set(user);
  return firebase
    .database()
    .ref(`phoneNumbers/${user._user.phoneNumber}`)
    .set(user);
};
