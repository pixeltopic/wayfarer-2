import jwt from "jsonwebtoken";

const verifyToken = (token) => {
  // if true, token is still valid. else, user is already logged out or token is no longer valid.
  if (token && jwt.decode(token)) {
    const expiry = jwt.decode(token).exp;
    const now = new Date();
    console.log("Logged out from last session:", Math.ceil(now.getTime() / 1000) > expiry);
    
    return Math.ceil(now.getTime() / 1000) < expiry;
  }
  return false;
}

export default verifyToken;