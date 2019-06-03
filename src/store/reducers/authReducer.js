import { USER_DETAILS, SET_PICTURE, SET_USERNAME } from "../constants";

import defaultPicture from "../../assets/default_profile.png";

const INITIAL_STATE = {
  user: null,
  username: "",
  profilePicture: defaultPicture
};

export const authReducer = (state = INITIAL_STATE, action) => {
  if (action.type === USER_DETAILS) {
    return { ...state, user: action.payload };
  } else if (action.type === SET_USERNAME) {
    return {
      ...state,
      username: action.payload
    };
  }
  return state;
};
