import { UPDATE_ACTIVE_DISCOVER } from "./types";

export const updateActiveDiscover = activeItem => {
  // Based on activeItem (which can be 'directions', 'incidents', 'places') rerenders Discover.js.
  // Useful instead of local state management because callbacks from different components in the app may want to render a specific panel.
  return {
    type: UPDATE_ACTIVE_DISCOVER,
    payload: activeItem
  };
}