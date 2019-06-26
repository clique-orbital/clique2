import {
  TOGGLE_EVENT_MODAL,
  POPULATE_ATTENDING,
  POPULATE_NOTATTENDING,
} from "../constants";

export const toggleEventModal = (mode, event) => {
  return {
    type: TOGGLE_EVENT_MODAL,
    payload: {
      mode,
      event
    }
  };
};

export const populateAttending = attending => {
  return {
    type: POPULATE_ATTENDING,
    payload: attending
  };
};

export const populateNotAttending = notAttending => {
  return {
    type: POPULATE_NOTATTENDING,
    payload: notAttending
  };
};
