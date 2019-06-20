import firebase from "react-native-firebase";
import { FETCH_EVENTS, CLEAR_EVENTS } from "../constants";

const db = firebase.database();

export const clearEvents = () => {
  return { type: CLEAR_EVENTS };
};

// get events from database
export const fetchEvents = groupId => async dispatch => {
  const snapshot = await db.ref(`events/${groupId}`).once("value");
  const events = snapshot.val();
  dispatch(storeEvents(groupId, events));
};

// send the events from database to redux store
const storeEvents = (groupid, events) => {
  return {
    type: FETCH_EVENTS,
    groupid,
    events
  };
};

export const fetchAllEvents = uid => async dispatch => {
  await db.ref(`users/${uid}/groups`).once("value", snapshot => {
    Object.keys(snapshot.val()).forEach(groupId => {
      console.log(groupId);
      dispatch(fetchEvents(groupId));
    });
  });
};
