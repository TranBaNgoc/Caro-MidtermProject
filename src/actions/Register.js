import axios from 'axios';
import * as types from '../constants/ActionTypes';
import storage from '../constants/Firebase';

function RegisterSuccess() {
  return {
    type: types.REGISTER_SUCCESS
  };
}

function RegisterFail(error) {
  return {
    type: types.REGISTER_FAIL,
    error
  };
}

function RegisterPending() {
  return {
    type: types.REGISTER_PENDING
  };
}

function fetchRegister(username, password, displayname, image) {
  return dispatch => {
    dispatch(RegisterPending());
    const p = new Promise(resovle => {
      const storageRef = storage.storage().ref();
      const mainImage = storageRef.child(image.name);
      mainImage.put(image).then(() => {
        mainImage.getDownloadURL().then(url => {
          resovle(url);
        });
      });
    });

    return p.then(url => {
      return axios
      .post(`https://btcn06-1612431.herokuapp.com/user/register`, {
        username,
        password,
        displayname,
        avatar: url
      })
      .then(res => {
        if (res.data.error) {
          dispatch(RegisterFail(res.data.error));
        } else {
          dispatch(RegisterSuccess());
        }
      })
      .catch(() => {
        dispatch(RegisterFail("Đăng ký thất bại"));
      });
    }).catch(() => {
      dispatch(RegisterFail("Đăng ký thất bại"));
    })
  };
}

export default fetchRegister;
