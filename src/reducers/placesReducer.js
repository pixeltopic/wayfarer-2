import { FETCH_PLACES } from "../actions/types";

export default (state={}, action) => {
  switch(action.type) {
    case FETCH_PLACES:
      return { ...action.payload.places };
    default:
      return state;
  }
}