import { FETCH_DIRECTIONS } from "../actions/types";

export default (state={}, action) => {
  switch(action.type) {
    case FETCH_DIRECTIONS:
      // return { ...action.payload };
      return { ...action.payload.directions };
    default:
      return state;
  }
}