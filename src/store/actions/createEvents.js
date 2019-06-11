import { 
    TOGGLE_FROMDATEPICKER, 
    TOGGLE_TODATEPICKER, 
    PICK_FROM_DATE, 
    PICK_TO_DATE, 
    SET_GROUPID,
    CHANGE_TEXT,
    RESET_EVENT_TYPE
} from "../constants";

const resetEventState = () => {
    return {
        type: RESET_EVENT_TYPE,
    }
}
const toggleFromDatePicker = visibility => {
    return {
        type: TOGGLE_FROMDATEPICKER,
        payload: visibility,
    }
}

const toggleToDatePicker = visibility => {
    return {
        type: TOGGLE_TODATEPICKER,
        payload: visibility,
    }
}

const changeText = (key, text) => {
    return {
        type: CHANGE_TEXT,
        payload: {
            key,
            text
        }
    }
}

const pickFromDate = date => {
    return {
        type: PICK_FROM_DATE,
        payload: date
    }
}

const pickToDate = date => {
    return {
        type: PICK_TO_DATE,
        payload: date
    }
}

const setGroupID = groupID => {
    return {
        type: SET_GROUPID,
        payload: groupID
    }
}

export {
    toggleFromDatePicker,
    toggleToDatePicker,
    pickFromDate,
    pickToDate,
    setGroupID,
    changeText,
    resetEventState
}