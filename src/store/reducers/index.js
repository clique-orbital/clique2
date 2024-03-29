import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { authReducer } from "./authReducer";
import { groupsReducer } from "./groupsReducer";
import { messagesReducer } from "./messagesReducer";
import { createEventsReducer } from "./createEventsReducer";
import { eventModalReducer } from "./eventModalReducer";
import { messageCounterReducer } from "./messageCounterReducer";
import { calendarReducer } from "./calendarReducer";
import { pollModalReducer } from "./pollModalReducer";
import { themeReducer } from "./themeReducer";

export default combineReducers({
  authReducer,
  groupsReducer,
  messagesReducer,
  createEventsReducer,
  eventModalReducer,
  form: formReducer,
  calendar: calendarReducer,
  pollModal: pollModalReducer,
  messageCounterReducer,
  theme: themeReducer
});
