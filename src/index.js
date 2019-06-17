import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Router, Route, Switch } from "react-router-dom";
import thunk from 'redux-thunk';

import Layout from "./components/Layout";
import history from "./history";
import reducers from "./reducers";

import { routes } from "./utils";

import Home from "./pages/home/Home";
import Discover from "./pages/discover/Discover";
import Dashboard from "./pages/dashboard/Dashboard";
import Signup from "./pages/auth/Signup";
import Signin from "./pages/auth/Signin";
import Signout from "./pages/auth/Signout";
import NotFound from "./components/NotFound";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const checkToken = () => {
//   const token = localStorage.getItem("token");
//   if (verifyToken(token)) {
//     return token;
//   } else {
//     localStorage.removeItem("token");
//     return "";
//   }
// }
const store = createStore(
  reducers, 
  {
    auth: { authenticated: localStorage.getItem("token") }
  }, 
  composeEnhancers(applyMiddleware(thunk))
);


ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Layout>
        <Switch>
          <Route path={routes.HOME} exact component={Home} />
          <Route path={routes.SIGNIN} exact component={Signin} />
          <Route path={routes.SIGNUP} exact component={Signup} />
          <Route path={routes.SIGNOUT} exact component={Signout} />
          <Route path={routes.DISCOVER} exact component={Discover} />
          <Route path={routes.DASHBOARD} exact component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  </Provider>,
  document.querySelector('#root')
);