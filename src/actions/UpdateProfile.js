import axios from 'axios';
import * as types from '../constants/ActionTypes'

const ls = require('localStorage');

function UpdateSuccess(data) {
  return {
    type: types.UPDATE_SUCCESS,
    data
  };
}

function UpdateFail(error) {
  return {
    type: types.UPDATE_FAIL,
    error
  };
}

function UpdatePending() {
  return {
    type: types.UPDATE_PENDING
  };
}

export function fetchPostUpdateProfile(username, password, displayname) {
  return dispatch => {
    dispatch(UpdatePending());
    return axios
    .post(`https://btcn06-1612431.herokuapp.com/user/profile`, {
      username,
      password,
      displayname
    })
    .then(res => {
      if (res.data.error) {
        dispatch(UpdateFail(res.data.error));
      } else {
        const data = {
          username,
          password,
          displayname
        };
        dispatch(UpdateSuccess(data));
      }
    }).catch(error => {
      dispatch(UpdateFail(error.response.data.error));
    });
  };
}

export function fetchGetProfile() {
  return dispatch => {
    dispatch(UpdatePending());
    return axios
    .get(`https://btcn06-1612431.herokuapp.com/me`, {
      headers: {
        'Authorization': `Bearer ${ls.getItem(`token`)}`
      }
    }).then(res => {
      dispatch(UpdateSuccess(res.data));
      return res.data;
    }).catch(err => {
      dispatch(UpdateFail(err));
      return false;
    })
  }
}
