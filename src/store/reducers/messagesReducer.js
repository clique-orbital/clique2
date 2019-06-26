import {
  FETCH_CONVERSATION,
  CHANGE_PREV_DATE,
  REMOVE_GROUP_MESSAGES
} from "../constants";
import _ from "lodash";

export const messagesReducer = (state = {}, action) => {
  if (action.type === FETCH_CONVERSATION) {
    const groupID = action.payload.groupID;
    return {
      ...state,
      [groupID]: {
        ...state[groupID],
        messages: [...action.payload.messages]
      }
    };
  } else if (action.type === CHANGE_PREV_DATE) {
    const groupID = action.payload.groupID;
    return {
      ...state,
      [groupID]: {
        ...state[groupID],
        prevDate: action.payload.prevDate
      }
    };
  } else if (action.type === REMOVE_GROUP_MESSAGES) {
    return _.omit(state, action.payload);
  } else {
    return state;
  }
};
