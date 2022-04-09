const httpStatus = require('http-status');
const { User, WalletEth } = require('../models');
const ApiError = require('../utils/ApiError');

const create_user = async (body) => {
 
  const walletId = await WalletEth.create(body);
  if(!walletId){//지갑이 만들어지지 않았다면
    //이미 해당 월렛으로 가입한적 있는지 확인
    if (await User.searchByWallet(body) != false) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Already registered with this address');
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

const get_user_by_wallet = async (query) => {
  const userAndWallet = await User.searchByWallet(query);
  if(!userAndWallet){
    throw new ApiError(httpStatus.NOT_FOUND, 'No user found');
  }else{
    return userAndWallet; 
  }
}

const check_nickname = async (query) => {
  const ifTaken = await User.isNicknameTaken({nickname: query.check_value});
  if(ifTaken){
    throw new ApiError(httpStatus.CONFLICT, 'Nickname already taken');
    }
  return JSON.stringify({result: true});
}

const get_user_by_id = async (params) => {
  //TODO 닉넴중복여부확인

  const userAndWallet = await User.searchById(params);
  if(!userAndWallet){
    throw new ApiError(httpStatus.NOT_FOUND, 'No user found');
  }else{
    return userAndWallet; 
  }
}

const update_user_by_id = async (params,body) => {
  
  const nicknameCheck = await User.isNicknameTaken(body);
  console.log(nicknameCheck);
  if(nicknameCheck){
  throw new ApiError(httpStatus.CONFLICT, 'Nickname already taken');
  }
  const userAndWallet = await User.updatepatchUserById(params,body);
  if(!userAndWallet){
    throw new ApiError(httpStatus.NOT_FOUND, 'No user found');
  }else{
    return JSON.stringify({result: true});
  }
}
module.exports = {
  create_user,
  get_user_by_wallet,
  get_user_by_id,
  update_user_by_id,
  check_nickname,
  // deleteUserById,
};
