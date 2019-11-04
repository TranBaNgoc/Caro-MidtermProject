import * as types from '../constants/ActionTypes';

const initialState = {
  history: [
    {
      squares: Array(400).fill(null),
      position: -1
    }
  ],
  xIsNext: true,
  stepNumber: 0,
  isIncrease: true,
  pending: false,
  user: null,
  error: null,
  messages: [],
  playWithBot: false,
  onGame: false,
  winner: null
};

function Game(state = initialState, action) {
  switch (action.type) {
    case types.RESET_GAME:
      return {
        ...state,
        xIsNext: true,
        history: [
          {
            squares: Array(400).fill(null),
            position: -1
          }
        ],
        stepNumber: 0,
        winner: null
      };
    case types.ADD_STEP:
      return {
        ...state,
        history: action.history,
        stepNumber: action.stepNumber,
        xIsNext: action.xIsNext
      };
    case types.SORT:
      return {
        ...state,
        isIncrease: !state.isIncrease
      };
    case types.JUMP_TO_STEP:
      return {
        ...state,
        stepNumber: action.stepNumber,
        xIsNext: action.stepNumber % 2 === 0,
        winner: action.isEnd === false ? null : state.winner,  
      };

    // Login --------------------------------------
    case types.LOGIN_FAIL:
      return {
        ...state,
        error: action.error,
        pending: false
      };
    case types.LOGIN_PENDING:
      return {
        ...state,
        pending: true
      };
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        pending: false,
        user: action.user
      };
    // -----------------------------------------------

    case types.CREATE_ROOM:
      return {
        ...state,
        playWithBot: action.playWithBot,
        onGame: true
      };

    case types.LOGOUT:
      return initialState;

    case types.ADD_MESSAGE:
      return {
        ...state,
        messages: action.message
      };
    case types.LEAVE_ROOM:
      return {
        ...state,
        history: [
          {
            squares: Array(400).fill(null),
            position: -1
          }
        ],
        xIsNext: true,
        stepNumber: 0,
        isIncrease: true,
        messages: [],
        onGame: false,
        playWithBot: false,
        winner: null
      };
    case types.SET_FIRST_MOVE:
      return {
        ...state,
        xIsNext: false
      };
    case types.ADD_WINNER:
      return {
        ...state,
        winner: action.winner
      };

    default:
      return state;
  }
}

export default Game;
