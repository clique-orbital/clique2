import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { authReducer } from "./authReducer";
import { groupsReducer } from "./groupsReducer";
import { messagesReducer } from "./messagesReducer";
import { createEventsReducer } from "./createEventsReducer";

export default combineReducers({ 
    authReducer, 
    groupsReducer,
    messagesReducer,
    createEventsReducer,
    form: formReducer 
});