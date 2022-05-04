const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, tokenService} = require('../services');


const login = catchAsync(async (req, res) => {
  const { user_id, secret } = req.body;
  const isSuccess = await authService.loginUserWithIdAndSecret(user_id, secret);
  
  const tokens = await tokenService.generateAuthTokens(user_id);
  res.send({ tokens });
  
});

// const logout = catchAsync(async (req, res) => {
//   await authService.logout(req.body.refreshToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const refreshTokens = catchAsync(async (req, res) => {
//   const tokens = await authService.refreshAuth(req.body.refreshToken);
//   res.send({ ...tokens });
// });

module.exports = {
  login,
  // logout,
  // refreshTokens,
};
