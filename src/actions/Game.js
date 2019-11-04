import * as types from '../constants/ActionTypes'

export const AddStep = (history, stepNumber, xIsNext) => ({
    type: 'ADD_STEP',
    history,
    stepNumber,
    xIsNext
})

export const AddMessage = (message) => ({
    type: types.ADD_MESSAGE,
    message
})

export const ResetGame = () => ({
    type: types.RESET_GAME
})

export const Sort = () => ({
    type: types.SORT
})

export const JumpToStep = (stepNumber, isEnd) => ({
    type: types.JUMP_TO_STEP,
    stepNumber,
    isEnd
})

export const Logout = () => ({
    type: types.LOGOUT
})

export const LeaveRoom = () => ({
    type: types.LEAVE_ROOM
})

export const SetFirstMove = () => ({
    type: types.SET_FIRST_MOVE
})

export const AddWinner = winner => ({
    type: types.ADD_WINNER,
    winner
})