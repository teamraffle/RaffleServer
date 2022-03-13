const httpStatus = require('http-status');
const { User, WalletEth } = require('../models');
const ApiError = require('../utils/ApiError');

const createUser = async (body) => {
 
  const walletId = await WalletEth.create(body);
  if(!walletId){
  //TODO 가입된 회원 중 월렛 중복여부
      // if (await User.isNicknameTaken(userBody.email)) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, 'Already registered');
    // }
  }
    //TODO 닉네임 중복체크하기
  // if (await User.isNicknameTaken(userBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Nickname already taken');
  // }
  const userID = await User.create(body, walletId);
  
  return userID;
};


module.exports = {
  createUser,
  // queryUsers,
  // getUserById,
  // getUserByEmail,
  // updateUserById,
  // deleteUserById,
};
