import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import { createStore, combineReducers,applyMiddleware,compose } from "redux";
import thunk from 'redux-thunk';
import MemberReducer from '../src/store/reducers/member';


const composeEnhancers =
  (process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null) || compose;

const rootReducer = combineReducers({
  members: MemberReducer,
});

const store = createStore(rootReducer, {},composeEnhancers(applyMiddleware(thunk)));

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(app,
  document.getElementById('root')
);
