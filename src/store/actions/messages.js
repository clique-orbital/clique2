import { FETCH_CONVERSATION, FETCH_NEW_MESSAGE } from "../constants";

export const fetchedConversation = (groupID, messages) => {
    return {
        type: FETCH_CONVERSATION,
        payload: {
            groupID,
            messages,
        }
    }
}

export const fetchNewMessage = (groupID, message) => {
    return {
        type: FETCH_NEW_MESSAGE,
        payload: {
            groupID,
            message,
        }
    }
}