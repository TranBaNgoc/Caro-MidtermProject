import * as types from '../constants/ActionTypes'

const initialState = {
    pending: false,
}

export default function RegisterReducer(state = initialState, action) {
    switch(action.type) {
        case types.SEARCH_COMPETITOR: 
            return {
                ...state,
                pending: true
            }
        case types.HAD_COMPETITOR:
            return {
                ...state,
                pending: false
            }
        default: 
            return state;
    }
}
