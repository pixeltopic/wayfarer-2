import { FORM_CACHE } from "../actions/types";

export default (state={}, action) => {
  switch(action.type) {
    case FORM_CACHE:
      return { ...state, [action.payload.name]: { ...action.payload.values } };
    default:
      return state;
  }
}