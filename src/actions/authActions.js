import axios from "axios";

import { AUTH_USER, AUTH_ERROR } from "./types";


export const signup = ({ email, password }, callback) => async dispatch => {
  try {
    console.log(`${process.env.REACT_APP_API_URL}/api/signup`);
    console.log(process.env.REACT_APP_API_URL);
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/signup`, { email, password });
    dispatch({ type: AUTH_USER, payload: response.data.token });
    dispatch({ type: AUTH_ERROR, payload: "" });

    if (callback) callback();

  } catch(e) {
    console.log(e);
    dispatch({ type: AUTH_ERROR, payload: e.response.data.error });
  }
}

// export const signin = ({ email, password }, callback) => {
//   return async (dispatch) => {
//     try {
//       const response = await axios.post("http://localhost:3090/signin", { email, password });
//       dispatch({ type: AUTH_USER, payload: response.data.token });
//       localStorage.setItem("token", response.data.token);
//       callback(); // callback for redirecting user
//     } catch(e) {
//       dispatch({ type: AUTH_ERROR, payload: "Invalid login credentials" });
//     }
//   }
// }

// export const signout = () => {
//   localStorage.removeItem("token");
//   return {
//     type: AUTH_USER,
//     payload: ""
//   }
// }