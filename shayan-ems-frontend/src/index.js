import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import reducers from "./Redux/reducers";
import { composeWithDevTools } from "redux-devtools-extension";

let userInfoFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

let initialState = {
  users: userInfoFromStorage,
};

const middlewares = [thunk];
const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
