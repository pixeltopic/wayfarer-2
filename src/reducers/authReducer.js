import { AUTH_USER, AUTH_REFRESHING_TOKEN } from "../actions/types";

const INITIAL_STATE = {
  authenticated: "",
  refreshingToken: false
};

export default (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case AUTH_USER:
      return { ...state, authenticated: action.payload };
    case AUTH_REFRESHING_TOKEN:
      return { ...state, refreshingToken: action.payload };
    default:
      return state;
  }
}