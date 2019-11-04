import * as types from '../constants/ActionTypes';

const initialState = {
  pending: false,
  error: null,
  displayname: null,
  username: null,
  password: null,
  avatar: "user.png",
};

export default function UpdateProfileReducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_PENDING:
      return {
        ...state,
        pending: true
      };
    case types.UPDATE_SUCCESS:
      return {
        ...state,
        pending: false,
        displayname: action.data.displayname,
        username: action.data.username,
        password: action.data.password,
        error: null
      };
    case types.UPDATE_FAIL:
      return {
        ...state,
        pending: false,
        error: action.error
      };
    default:
      return state;
  }
}
