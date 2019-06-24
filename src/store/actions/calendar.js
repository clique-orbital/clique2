import firebase from "react-native-firebase";
import { FETCH_EVENTS, CLEAR_EVENTS } from "../constants";
import _ from "lodash"

const db = firebase.database();

export const clearEvents = () => {
  return { type: CLEAR_EVENTS };
};

// get events from database
export const fetchEvents = groupId => async dispatch => {
  return db.ref(`events/${groupId}`).once("value", snapshot => {
    dispatch(storeEvents(groupId, snapshot.val()));
  });
};

// send the events from database to redux store
const storeEvents = (groupid, events) => {
  return {
    type: FETCH_EVENTS,
    groupid,
    events
  };
};

export const fetchAllEvents = uid => dispatch => {
  return db.ref(`users/${uid}/groups`).once("value", snapshot => {
    _.keys(snapshot.val()).forEach(groupId => {
      dispatch(fetchEvents(groupId));
    });
  });
};
