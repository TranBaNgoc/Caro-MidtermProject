// import * as types from '../constants/ActionTypes'
import axios from 'axios';

const localStorage = require('localStorage');

function LoginSuccess(user) {
  return {
    type: 'LOGIN_SUCCESS',
    user
  };
}

function LoginFail(error) {
  return {
    type: 'LOGIN_FAIL',
    error
  };
}

function LoginPending() {
  return {
    type: 'LOGIN_PENDING'
  };
}

export function fetchLogin(username, password) {
  return dispatch => {
    dispatch(LoginPending());
    return axios
      .post(`https://btcn06-1612431.herokuapp.com/user/login`, {
        username,
        password
      })
      .then(res => {
        if (!res.data.token) {
          dispatch(LoginFail(res.data.error));
          return false;
        }

        localStorage.setItem(
          'displayname',
          res.data.user.displayname  
        );

        localStorage.setItem(
          'avatar',
          res.data.user.avatar
        )

        localStorage.setItem('token', res.data.token)
        dispatch(LoginSuccess(res.data.user));
        return true;
      })
      .catch(() => {

        dispatch(LoginFail("Đăng nhập không thành công"));
        return false;
      });
  };
}

export function fetchLoginFacebook() {
  return dispatch => {
    dispatch(LoginPending());
    return axios
      .get(`https://localhost:4000/user/auth/facebook`)
      .then(res => {
        if (!res.data.token) {
          dispatch(LoginFail(res.data.error));
          return false;
        }

        localStorage.setItem(
          'displayname',
          res.data.user.displayname  
        );

        localStorage.setItem(
          'avatar',
          res.data.user.avatar
        )

        localStorage.setItem('token', res.data.token)
        dispatch(LoginSuccess(res.data.user));
        return true;
      })
      .catch(() => {

        dispatch(LoginFail("Đăng nhập không thành công"));
        return false;
      });
  };
}