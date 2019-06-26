import firebase from "react-native-firebase";
import { FETCH_EVENTS, CLEAR_EVENTS, REMOVE_GROUP_EVENTS, STORE_PERSONAL_EVENTS } from "../constants";
import _ from "lodash";

const db = firebase.database();

export const clearEvents = () => {
  return { type: CLEAR_EVENTS };
};

export const removeGroupEvents = groupID => {
  return { type: REMOVE_GROUP_EVENTS, payload: groupID };
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

export const fetchPersonalEvents = uid => async (dispatch) => {
  const attendingSnapshot = await db.ref(`users/${uid}/attending`).once('value');
  if (!attendingSnapshot) return [];
  const attending = (attendingSnapshot || {}).val();
  const attendingGroups = _.keys(attending);

  const attendingEvents = attendingGroups.map(groupID => {
    const attendingGroupEventIDs = _.keys(attending[groupID])
    const attendingGroupEvents = attendingGroupEventIDs.map(async eventID => {
      const eventSnapshot = await db.ref(`events/${groupID}/${eventID}`).once('value');
      return eventSnapshot.val();
    })
    return attendingGroupEvents;
  })

  Promise.all(_.flatten(attendingEvents)).then(events => dispatch(storePersonalEvents(events)))
}

const storePersonalEvents = events => {
  return {
    type: STORE_PERSONAL_EVENTS,
    payload: events
  }
}
