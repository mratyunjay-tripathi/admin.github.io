import ActionTypes from '../actions/actionTypes';

export default function memberReducer(state = [], action) {
    switch (action.type) {
        case ActionTypes.ADD_MEMBERS: return state.concat(action.payload);

        default: return state;
    }
};