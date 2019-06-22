import { FETCH_PLACES, FETCH_MORE_PLACES ,FETCH_PLACE_DETAILS } from "../actions/types";
import _ from "lodash";

const INITIAL_STATE = {
  results: [],
  center: null,
  placeDetails: null,
  cachedPlaceDetailsId: "", // prevents extra fetching from google place details api to limit rates
  nextPageToken: ""
};

export default (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case FETCH_PLACES:
      let newStateUpdate = _.omit(action.payload.places, "html_attributions", "status", "results");
      // results are divided into a 2d array, with each inner array representing a page of up to 20 search results.
      return { ...state, results: [action.payload.places.results] , ...newStateUpdate, nextPageToken: action.payload.places.nextPageToken || "" };
    case FETCH_MORE_PLACES:
      // center and place details should rename the same
      return { ...state, results: state.results.concat([action.payload.places.results]), nextPageToken: action.payload.places.nextPageToken || "" };
    case FETCH_PLACE_DETAILS:
      const { result, place_id } = action.payload.placeDetails
      return { ...state, placeDetails: result, cachedPlaceDetailsId: place_id };
    default:
      return state;
  }
}