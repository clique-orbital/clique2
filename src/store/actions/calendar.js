import firebase from "react-native-firebase";
import { FETCH_EVENTS, CLEAR_EVENTS } from "../constants";

const db = firebase.database();

export const clearEvents = () => {
  return { type: CLEAR_EVENTS };
};

// get events from database
export const fetchEvents = groupId => async dispatch => {
  const snapshot = await db.ref(`events/${groupId}`).once("value");
  const value = snapshot.val();
  if (value) {
    dispatch(storeEvents(value));
  }
};

// send the events from database to redux store
const storeEvents = events => {
  return {
    type: FETCH_EVENTS,
    payload: events
  };
};
