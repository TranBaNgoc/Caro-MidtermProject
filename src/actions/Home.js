import * as types from '../constants/ActionTypes';

export const CreateRoom = (playWithBot) => ({
    type: types.CREATE_ROOM,
    playWithBot
})

export const SearchCompetitor = () => ({
    type: types.SEARCH_COMPETITOR
})

export const HadCompetitor = () => ({
    type: types.HAD_COMPETITOR
})

