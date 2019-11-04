import {combineReducers} from 'redux';
import Game from './Game';
import RegisterReducer from './Register';
import UpdateProfileReducer from './UpdateProfile';

export default combineReducers({
    Game, RegisterReducer, UpdateProfileReducer
})
