import { AUTH_ERROR } from "../actions/types";

const INITIAL_STATE = {
  authMessage: ""
}

export default (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case AUTH_ERROR:
      return { ...state, authMessage: action.payload };
    default:
      return state;
  }
}