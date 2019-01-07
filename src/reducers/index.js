import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";
import mapsReducer from "./mapsReducer";
import incidentsReducer from "./incidentsReducer";

export default combineReducers({
  error: errorReducer, // stores all error messages in the application. error messages are cleared through dispatches
  auth: authReducer,
  maps: mapsReducer, // stores cached data fetched from google maps
  incidents: incidentsReducer // stores cached data from mapquest incidents
});