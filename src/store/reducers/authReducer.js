import { USER_DETAILS, SET_USERNAME_AND_PICTURE } from "../constants";

import defaultPicture from "../../assets/default_profile.png";

const INITIAL_STATE = {
  user: null,
  username: "",
  profilePicture: defaultPicture
};

export const authReducer = (state = INITIAL_STATE, action) => {
  if (action.type === USER_DETAILS) {
    return { ...state, user: action.payload };
  } else if (action.type === SET_USERNAME_AND_PICTURE) {
    return {
      ...state,
      username: action.payload.username,
      profilePicture: action.payload.picture
    };
  }
  return state;
};
