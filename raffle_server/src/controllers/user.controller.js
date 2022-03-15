const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const userId = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(userId);
});

const getUserbyWallet = catchAsync(async (req, res) => {
  const userAndWallet = await userService.getUserbyWallet(req.query);
  res.status(httpStatus.OK).send(userAndWallet);
});

const getUserbyId = catchAsync(async (req, res) => {
  const userAndWallet = await userService.getUserbyId(req.params);
  res.status(httpStatus.OK).send(userAndWallet);

});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params, req.body);
  res.status(httpStatus.OK).send(user);

});

// const deleteUser = catchAsync(async (req, res) => {
//   await userService.deleteUserById(req.params.userId);
//   res.status(httpStatus.NO_CONTENT).send();
// });

module.exports = {
  createUser,
  getUserbyWallet,
  getUserbyId,
  updateUser,
  // deleteUser,
};
