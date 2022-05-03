const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, tokenService} = require('../services');


const login = catchAsync(async (req, res) => {
  const { address, secret, chain_id } = req.body;
  const isSuccess = await authService.loginUserWithAddrAndSecret(address, secret);
  
  const tokens = await tokenService.generateAuthTokens(address);
  res.send({ tokens });
  
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

// const refreshTokens = catchAsync(async (req, res) => {
//   const tokens = await authService.refreshAuth(req.body.refreshToken);
//   res.send({ ...tokens });
// });

module.exports = {
  login,
  logout,
  // refreshTokens,
};
