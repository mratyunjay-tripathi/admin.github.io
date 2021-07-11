import ActionTypes from '../actions/actionTypes';

export default function memberReducer(state = [], action) {
    switch (action.type) {
        case ActionTypes.ADD_MEMBERS: return state.concat(action.payload);

        case ActionTypes.UPDATE: return [...action.payload];

        case ActionTypes.DELETE: return [...action.payload];

        default: return state;
    }
};