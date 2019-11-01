import * as types from '../constants/ActionTypes'

export const AddStep = (history, stepNumber, xIsNext) => ({
    type: 'ADD_STEP',
    history,
    stepNumber,
    xIsNext
})

export const ResetGame = () => ({
    type: types.RESET_GAME
})

export const Sort = () => ({
    type: types.SORT
})

export const JumpToStep = (stepNumber) => ({
    type: types.JUMP_TO_STEP,
    stepNumber
})

export const Logout = () => ({
    type: types.LOGOUT
})