import { USER_DETAILS, SET_USERNAME_AND_PICTURE } from "../constants";

// action creator for authDetails for the phone authentication
// response from sign in after code is sent
export const setUserDetails = userDetails => {
  return {
    type: USER_DETAILS,
    payload: userDetails
  };
};

export const setUsernameAndProfile = (username, picture) => {
  return {
    type: SET_USERNAME_AND_PICTURE,
    payload: { username, picture }
  };
};
