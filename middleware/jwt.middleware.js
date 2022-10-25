const { expressjwt: jwt } = require("express-jwt");
const { token } = require("morgan");

// Function used to extracts the JWT token from the request's 'Authorization' Headers
const getTokenFromHeaders = (req) => {
  const { authorization } = req.headers;
  cont[(type, token)] = authorization.split(" ");
  if (type === "Bearer") {
    return token;
  }
  return null;
};

//Intantiate the JWT token validation middleware
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromHeaders,
});

module.exports = { isAuthenticated };
