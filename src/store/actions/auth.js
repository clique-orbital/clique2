import firebase from "react-native-firebase";
import { USER_DETAILS, SIGN_OUT } from "../constants";

// action creator for authDetails for the phone authentication
// response from sign in after code is sent
export const setUserDetails = userDetails => {
  return {
    type: USER_DETAILS,
    payload: userDetails
  };
};

// export const signOutUser = dispatch => {
//   dispatch({ type: SIGN_OUT });
// }

// export const signOutUser = () => {
//   return {
//     type: SIGN_OUT,
//   }
// }

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
  const savedMessagesGroup = {
    last_message: {
      data: "",
      image: "",
      timestamp: "",
      user_id: "",
      video: ""
    },
    users_info: {
      user_id: user._user.uid
    }
  };

  await firebase
    .database()
    .ref(`groups`)
    .push(savedMessagesGroup)
    .then(async res => {
      const groups = {};
      console.log(res.path);
      groups.savedMessages = res.path;
      const user2 = { ...user._user, groups };
      await firebase
        .database()
        .ref(`users/${user._user.uid}`)
        .set(user2);
      await firebase
        .database()
        .ref(`phoneNumbers/${user._user.phoneNumber}`)
        .set(user2);
    })
    .catch(err => console.log(err));
};
