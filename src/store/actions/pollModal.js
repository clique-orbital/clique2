import {
  TOGGLE_POLL_MODAL,
} from "../constants";

export const togglePollModal = mode => {
  return {
    type: TOGGLE_POLL_MODAL,
    payload: {
      mode
    }
  };
};
