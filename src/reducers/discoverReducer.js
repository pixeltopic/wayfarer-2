import { UPDATE_ACTIVE_DISCOVER } from "../actions/types";

const INITIAL_STATE = {
  activeItem: "directions"
};

export default (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case UPDATE_ACTIVE_DISCOVER:
      return { ...state, activeItem: action.payload };
    default:
      return state;
  }
}