import * as types from '../constants/ActionTypes';

const CreateRoom = (playWithBot) => ({
    type: types.CREATE_ROOM,
    playWithBot
})

export default CreateRoom;