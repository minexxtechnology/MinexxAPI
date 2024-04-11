const jwt = require("jsonwebtoken");
const config = require("../config/default");

const signJwt = ( object, options) => {
  const signingKey = config.privateKey;

  return jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: `RS256`,
  });
};

const verifyJwt = (token) => {
  const publicKey = config.publicKey;

  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e) {
    return {
      valid: false,
      expired: e.message === `jwt expired`,
      decoded: null,
    };
  }
};

module.exports = {
  signJwt,
  verifyJwt,
};
