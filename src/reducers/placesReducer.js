import { FETCH_PLACES, FETCH_PLACE_DETAILS } from "../actions/types";

const INITIAL_STATE = {
  results: [],
  center: null,
  placeDetails: null
};

export default (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case FETCH_PLACES:
      return { ...state, ...action.payload.places };
    case FETCH_PLACE_DETAILS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}