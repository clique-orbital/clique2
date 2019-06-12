import firebase from "react-native-firebase";

import { FETCH_CONVERSATION, CHANGE_PREV_DATE } from "../constants";

export const fetchedConversation = (groupID, messages) => {
  return {
    type: FETCH_CONVERSATION,
    payload: {
      groupID,
      messages
    }
  };
};

export const changePrevDate = (groupID, prevDate) => {
  return {
    type: CHANGE_PREV_DATE,
    payload: {
      groupID,
      prevDate
    }
  };
};

export const updateLastMessage = (groupId, message) => async dispatch => {
  await firebase
    .database()
    .ref(`groups/${groupId}/last_message`)
    .set(message)
    .then(res => console.log(res))
    .catch(err => console.log(err));
};

// export const fetchNewMessage = (groupID, message) => {
//     return {
//         type: FETCH_NEW_MESSAGE,
//         payload: {
//             groupID,
//             message,
//         }
//     }
// }
