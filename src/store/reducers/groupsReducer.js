import { INITIALIZE_GROUPS, ADD_NEW_GROUP } from "../constants";

const initialState = {
    groups: []
}

export const groupsReducer = (state = initialState, action) => {
    switch(action.type) {
        case INITIALIZE_GROUPS:
            return {
                ...state,
                groups: action.payload
            }
        case ADD_NEW_GROUP:
            return {
                ...state,
                groups: [...state.groups, action.payload]
            }
        default:
            return state;
    }
}