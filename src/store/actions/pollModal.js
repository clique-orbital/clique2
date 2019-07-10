import {
  TOGGLE_POLL_MODAL,
} from "../constants";

const initialPollState = {
  groupID: "",
  msgID: "",
  options: {},
  questions: "",
}

export const togglePollModal = (mode, poll = initialPollState) => {
  return {
    type: TOGGLE_POLL_MODAL,
    payload: {
      mode,
      poll
    }
  };
};
