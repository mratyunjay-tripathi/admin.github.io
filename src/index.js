import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";

import MemberReducer from '../src/store/reducers/member';
// import thunk from "redux-thunk";



// const composeEnhancers =
//   (process.env.NODE_ENV === "development"
//     ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
//     : null) || compose;

// const persistConfig = {
//   key: "root",
//   storage,
// };

const rootReducer = combineReducers({
  members: MemberReducer,
});

// const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(rootReducer,{});


// let persistor = persistStore(store);

const app = (
  <Provider store={store}>
        <App />
  </Provider>
);

ReactDOM.render(app,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
