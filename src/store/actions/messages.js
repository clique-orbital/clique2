import {
  FETCH_CONVERSATION,
  REMOVE_GROUP_MESSAGES,
  ADD_NEW_MSG
} from "../constants";

export const fetchConversation = (groupID, messages) => {
  return {
    type: FETCH_CONVERSATION,
    payload: {
      groupID,
      messages
    }
  };
};

export const addNewMsgToConvo = (groupID, message) => {
  return {
    type: ADD_NEW_MSG,
    payload: {
      groupID,
      message
    }
  }
}

export const removeGroupMessages = groupID => {
  return {
    type: REMOVE_GROUP_MESSAGES,
    payload: groupID
  };
};
