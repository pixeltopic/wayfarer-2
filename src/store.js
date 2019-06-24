import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  {
    auth: {
      authenticated: localStorage.getItem("token") || "",
      refreshingToken: false,
      refreshingCall: null
    }
  },
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
