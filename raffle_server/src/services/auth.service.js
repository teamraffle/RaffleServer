const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithIdAndSecret = async (user_id, secret) => {
  const { createHmac } = await import('node:crypto');

  const secretKey = 'abcdefg';
  const hash = createHmac('sha256', secretKey)
                .update(user_id)
                .digest('hex');
  
  if (secret != hash) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect secret phrase');
  }
  return true
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};


// const refreshAuth = async (refreshToken) => {
//   try {
//     const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
//     const user = await userService.getUserById(refreshTokenDoc.user);
//     if (!user) {
//       throw new Error();
//     }
//     await refreshTokenDoc.remove();
//     return tokenService.generateAuthTokens(user);
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
//   }
// };

module.exports = {
  loginUserWithIdAndSecret,
  logout,
  // refreshAuth,
};
