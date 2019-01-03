import { AUTH_ERROR, AUTH_ERROR_RESET } from "../actions/types";

const INITIAL_STATE = {
  authMessage: ""
}

export default (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case AUTH_ERROR:
      return { ...state, authMessage: action.payload };
    case AUTH_ERROR_RESET:
      return { ...state, authMessage: "" };
    default:
      return state;
  }
}