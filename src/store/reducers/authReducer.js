import { USER_DETAILS, UPDATE_USER } from "../constants";

const INITIAL_STATE = {
  user: null,
  username: "",
  pictureUrl: ""
};

export const authReducer = (state = INITIAL_STATE, action) => {
  if (action.type === USER_DETAILS) {
    return { ...state, user: action.payload };
  } else if (action.type === UPDATE_USER) {
    return {
      ...state,
      username: action.payload.username,
      pictureUrl: action.payload.pictureUrl
    };
  }
  return state;
};
