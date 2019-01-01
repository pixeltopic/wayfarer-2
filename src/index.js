import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Router, Route } from "react-router-dom";
import thunk from 'redux-thunk';

import App from "./components/App";
import history from "./history";
import reducers from "./reducers";

import { routes } from "./utils";

import Discover from "./components/discover/Discover";
import Dashboard from "./components/dashboard/Dashboard";
import Signup from "./components/auth/Signup";
import Signin from "./components/auth/Signin";

// cd C:\Users\xmobl\Documents\GitRepos\wayfarer-2\client
// cd C:\Users\xmobl\Documents\GitRepos\wayfarer-2\server


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, {}, composeEnhancers(applyMiddleware(thunk)));


ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App>
        <Route path={routes.HOME} exact component={() => <div>Homepage</div>} />
        <Route path={routes.SIGNIN} exact component={Signin} />
        <Route path={routes.SIGNUP} exact component={Signup} />
        <Route path={routes.DISCOVER} exact component={Discover} />
        <Route path={routes.DASHBOARD} exact component={Dashboard} />
      </App>
    </Router>
  </Provider>,
  document.querySelector('#root')
);