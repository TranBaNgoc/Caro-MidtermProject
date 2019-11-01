// import * as types from '../constants/ActionTypes'
import axios from 'axios';

function RegisterSuccess() {
  return {
    type: 'UPDATE_SUCCESS',
  };
}

function RegisterFail(error) {
  return {
    type: 'UPDATE_FAIL',
    error
  };
}

function RegisterPending() {
  return {
    type: 'UPDATE_PENDING'
  };
}

function fetchRegister(username, password, displayname) {
  return dispatch => {
    dispatch(RegisterPending());
    return axios
    .post(`https://btcn06-1612431.herokuapp.com/user/register`, {
      username,
      password,
      displayname
    })
    .then(res => {
      if (res.data.error) {
        dispatch(RegisterFail(res.data.error));
      } else {
        dispatch(RegisterSuccess);
      }
    }).catch(error => {
      dispatch(RegisterFail(error));
    });
  };
}

export default fetchRegister;
