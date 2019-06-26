import { TOGGLE_EVENT_MODAL, POPULATE_ATTENDING, POPULATE_NOTATTENDING } from "../constants";

const initialState = {
    modalVisibility: false
}

export const eventModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_EVENT_MODAL:
            return {
                ...state,
                modalVisibility: action.payload.mode,
                event: action.payload.event,
            }
        case POPULATE_ATTENDING:
            return {
                ...state,
                attending: action.payload,
            }
        case POPULATE_NOTATTENDING:
            return {
                ...state,
                notAttending: action.payload,
            }
        default:
            return state;
    }
}