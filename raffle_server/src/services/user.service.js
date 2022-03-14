const httpStatus = require('http-status');
const { User, WalletEth } = require('../models');
const ApiError = require('../utils/ApiError');

const createUser = async (body) => {
 
  var walletId = await WalletEth.create(body);
  
  if(!walletId){//지갑이 만들어지지 않았다면
    //이미 해당 월렛으로 가입한적 있는지 확인
    if (await User.searchByWallet(body) != false) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Already registered with this address');
    }else{ //월렛 아이디 불러오기
      walletId = await WalletEth.findIdByAddress(body);
    }
  }
  //닉네임 중복체크하기
  if (await User.isNicknameTaken(body)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Nickname already taken');
  }
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
  getUserbyId,
  // updateUserById,
  // deleteUserById,
};
