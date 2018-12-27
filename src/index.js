import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Router, Route } from "react-router-dom";
import thunk from 'redux-thunk';

import App from "./components/App";
import history from "./history";
import reducers from "./reducers";

import SearchRouteForm from "./components/discover/SearchRouteForm";



const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));


ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App>
        <Route path="/" exact component={SearchRouteForm} />
        
      </App>
    </Router>
  </Provider>,
  document.querySelector('#root')
);