import {
  FETCH_CONVERSATION,
  REMOVE_GROUP_MESSAGES,
  SIGN_OUT,
  ADD_NEW_MSG
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
  } else if (action.type === ADD_NEW_MSG) {
    console.log("add new msg");
    const groupID = action.payload.groupID;
    return {
      ...state,
      [groupID]: {
        ...state[groupID],
        messages: [action.payload.message].concat(state[groupID].messages)
      }
    };
  } else if (action.type === REMOVE_GROUP_MESSAGES) {
    return _.omit(state, action.payload);
  } else if (action.type === SIGN_OUT) {
    return {};
  } else {
    return state;
  }
};
