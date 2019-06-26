import {
    TOGGLE_FROMDATEPICKER,
    TOGGLE_TODATEPICKER,
    PICK_FROM_DATE,
    PICK_TO_DATE,
    SET_GROUPID,
    CHANGE_TEXT,
    RESET_EVENT_TYPE
} from "../constants";

const initialState = {
    title: "",
    fromDateVisibility: false,
    toDateVisibility: false,
    fromDate: "",
    toDate: "",
    location: "",
    notes: "",
    groupID: ""
}

export const createEventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case RESET_EVENT_TYPE:
            return initialState;
        case CHANGE_TEXT:
            return {
                ...state,
                [action.payload.key]: action.payload.text
            }
        case TOGGLE_FROMDATEPICKER:
            return {
                ...state,
                fromDateVisibility: action.payload
            }
        case TOGGLE_TODATEPICKER:
            return {
                ...state,
                toDateVisibility: action.payload
            }
        case PICK_FROM_DATE:
            return {
                ...state,
                fromDate: action.payload
            }
        case PICK_TO_DATE:
            return {
                ...state,
                toDate: action.payload
            }
        case SET_GROUPID:
            return {
                ...state,
                groupID: action.payload
            }
        default:
            return state;
    }
}