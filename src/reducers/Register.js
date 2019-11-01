const initialState = {
    pending: false,
    error: null
}

export default function RegisterReducer(state = initialState, action) {
    switch(action.type) {
        case "REGISTER_PENDING": 
            return {
                ...state,
                pending: true
            }
        case "REGISTER_SUCCESS":
            return {
                ...state,
                pending: false,
            }
        case "REGISTER_FAIL":
            return {
                ...state,
                pending: false,
                error: action.error
            }
        default: 
            return state;
    }
}
