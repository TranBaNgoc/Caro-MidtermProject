import {combineReducers} from 'redux';
import Game from './Game';
import RegisterReducer from './Register';
import UpdateProfileReducer from './UpdateProfile';
import HomeReducer from './Home'

export default combineReducers({
    Game, RegisterReducer, UpdateProfileReducer, HomeReducer
})
