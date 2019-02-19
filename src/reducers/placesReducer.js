import { FETCH_PLACES, FETCH_PLACE_DETAILS } from "../actions/types";
import _ from "lodash";

const INITIAL_STATE = {
  results: [],
  center: null,
  placeDetails: null,
  cachedPlaceDetailsId: "" // prevents extra fetching from google place details api to limit rates
};

export default (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case FETCH_PLACES:
    const newStateUpdate = _.omit(action.payload.places, "html_attributions", "status");
      return { ...state, ...newStateUpdate };
    case FETCH_PLACE_DETAILS:
    const { result, place_id } = action.payload.placeDetails
      return { ...state, placeDetails: result, cachedPlaceDetailsId: place_id };
    default:
      return state;
  }
}