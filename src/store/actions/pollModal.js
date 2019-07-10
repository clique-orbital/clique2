import { TOGGLE_POLL_MODAL, UPDATE_POLL } from "../constants";

const initialPollState = {
  groupID: "",
  msgID: "",
  options: [],
  questions: ""
};

export const togglePollModal = (mode, poll = initialPollState) => {
  return {
    type: TOGGLE_POLL_MODAL,
    payload: {
      mode,
      poll
    }
  };
};

export const updatePoll = poll => {
  return {
    type: UPDATE_POLL,
    payload: poll
  };
};
