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
  const msg ={
    userID : userID
  }
  return msg;
};

const getUserbyWallet = async (query) => {
  const userAndWallet = await User.searchByWallet(query);
  if(!userAndWallet){
    throw new ApiError(httpStatus.NOT_FOUND, 'No user found');
  }else{
    return userAndWallet; 
  }
}

const getUserbyId = async (params) => {
  const userAndWallet = await User.searchById(params);
  if(!userAndWallet){
    throw new ApiError(httpStatus.NOT_FOUND, 'No user found');
  }else{
    return userAndWallet; 
  }
}

module.exports = {
  createUser,
  getUserbyWallet,
  // queryUsers,
  getUserbyId,
  // getUserByEmail,
  // updateUserById,
  // deleteUserById,
};
