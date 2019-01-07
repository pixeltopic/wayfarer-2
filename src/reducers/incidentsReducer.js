import { FETCH_INCIDENTS } from "../actions/types";

export default (state={}, action) => {
  switch(action.type) {
    case FETCH_INCIDENTS:
      return { ...action.payload };
    default:
      return state;
  }
}