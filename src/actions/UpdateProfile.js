import axios from 'axios';
import * as types from '../constants/ActionTypes';
import storage from '../constants/Firebase';

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

export function fetchPostUpdateProfile(username, password, displayname, image) {
  return dispatch => {
    dispatch(UpdatePending());

    const p = new Promise(resovle => {
      if ((typeof image) === "string") {
        resovle(image);
      } else {
        const storageRef = storage.storage().ref();
        const mainImage = storageRef.child(image.name + Date.now());
        mainImage.put(image).then(() => {
          mainImage.getDownloadURL().then(url => {
            resovle(url);
          });
        });
      }
    });

   

    return p.then(url => {
      console.log(url);
      return axios
        .post(`https://btcn06-1612431.herokuapp.com/user/profile`, {
          username,
          password,
          displayname,
          avatar: url
        })
        .then(res => {
          if (res.data.error) {
            dispatch(UpdateFail(res.data.error));
          } else {
            const data = {
              username,
              password,
              displayname,
              avatar: url
            };
            dispatch(UpdateSuccess(data));
          }
        })
        .catch(() => {
          dispatch(UpdateFail("Cập nhật thông tin không thành công"));
        });
    });
  };
}

export function fetchGetProfile() {
  return dispatch => {
    dispatch(UpdatePending());
    return axios
      .get(`https://btcn06-1612431.herokuapp.com/me`, {
        headers: {
          Authorization: `Bearer ${ls.getItem(`token`)}`
        }
      })
      .then(res => {
        dispatch(UpdateSuccess(res.data));
        return res.data;
      })
      .catch(err => {
        dispatch(UpdateFail(err));
        return false;
      });
  };
}
