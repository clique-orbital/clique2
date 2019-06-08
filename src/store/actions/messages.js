import { FETCH_CONVERSATION } from "../constants";

export const fetchedConversation = (groupID, messages, firstFetchAllMount) => {
    return {
        type: FETCH_CONVERSATION,
        payload: {
            groupID,
            messages,
            firstFetchAllMount
        }
    }
}