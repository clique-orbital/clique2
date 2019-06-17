import { FETCH_CONVERSATION, CHANGE_PREV_DATE } from "../constants";

export const fetchConversation = (groupID, messages) => {
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
