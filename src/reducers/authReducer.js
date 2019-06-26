import { AUTH_USER, AUTH_REFRESHING_TOKEN, AUTH_REFRESHING_CALL } from "../actions/types";

const INITIAL_STATE = {
  authenticated: "",
  refreshingToken: false,
  refreshingCall: null // call to retry if 401 was hit
};

export default (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case AUTH_USER:
      return { ...state, authenticated: action.payload };
    case AUTH_REFRESHING_TOKEN:
      return { ...state, refreshingToken: action.payload };
    case AUTH_REFRESHING_CALL:
      return { ...state, refreshingCall: action.payload };
    default:
      return state;
  }
}