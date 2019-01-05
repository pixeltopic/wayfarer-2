import jwt from "jsonwebtoken";

const verifyInactiveToken = (token) => {
  // if true, token is still valid for refresh. If not user must reauthenticate
  if (token && jwt.decode(token)) {
    const expiry = jwt.decode(token).exp;
    const now = new Date();
    
    return (Math.ceil(now.getTime() / 1000) - expiry) < Number(process.env.REACT_APP_INACTIVE_TOKEN_TIME);
  }
  return false;
}

export default verifyInactiveToken;