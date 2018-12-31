import { AUTH_USER } from "./types";

export const signup = ({ email, password }) => async dispatch => {
  dispatch({ type: AUTH_USER });
}