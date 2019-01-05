import server from "../api/server";
import { updateToken } from "./authActions";

import { FETCH_DIRECTIONS } from "./types";

export const fetchDirections = searchProps => async (dispatch, getState) => {
  try {

    const config = { 
      headers : { authorization: getState().auth.authenticated }  
    };
    
    const response = await server.post("/api/fetchdirections", searchProps, getState().auth.authenticated ? config : null);

    dispatch({ type: FETCH_DIRECTIONS, payload: response.data });
    dispatch(updateToken(response));

  } catch(e) {
    console.log(e);
  }
}