import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { Router, Route, Switch } from "react-router-dom";

import store from "./store";
import Layout from "./components/Layout";
import history from "./history";

import { routes } from "./utils";

import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Dashboard from "./pages/Dashboard"
import Signup from "./pages/auth/Signup";
import Signin from "./pages/auth/Signin";
import Signout from "./pages/auth/Signout";
import NotFound from "./components/NotFound";

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