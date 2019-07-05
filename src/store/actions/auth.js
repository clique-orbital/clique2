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
  return (
    firebase
      .storage()
      .ref(`images/profile_pictures/${new Date().getTime()}.jpeg`)
      .put(pictureUri)
      .then(snapshot => {
        if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
          return user.updateProfile({
            displayName: username,
            photoURL: snapshot.downloadURL
          });
        } else {
          throw new Error("unable to update profile");
        }
      })
      .then(() => {
        user = firebase.auth().currentUser;
        user["_user"]["groups"] = "";
        return user;
      })
      // update user details in db
      .then(user => {
        userDetailsToDatabase(user);
        return user;
      })
      // update user details locally (redux store)
      .then(user => dispatch(setUserDetails(user)))
      .catch(err => {
        console.log(err.message);
      })
  );
};

// send user details to the database to be stored during account creation
const userDetailsToDatabase = user => {
  const uid = user._user.uid;
  const db = firebase.database();
  const promises = [
    db.ref(`users/${uid}`).set(user),
    db.ref(`phoneNumbers/${user._user.phoneNumber}`).set(user)
  ];
  return Promise.all(promises);
};
