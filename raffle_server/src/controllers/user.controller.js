const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, nftService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const userId = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(userId);

  await getAndSaveFirstData(req.body);
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

const checkNicknameDuplication = catchAsync(async (req, res) => {
  const ifTaken = await userService.checkNickname(req.query);
  res.status(httpStatus.OK).send(ifTaken);
});


const getAndSaveFirstData = async (address) => {
  try {
    
    // 지갑주소의 NFT 콜렉션 db에 저장
    const coll_set = await nftService.get_nft_moralis(address , 1);
    // 지갑주소의 NFT db에 저장
    await nftService.get_nft_moralis(address , 1);
    // 지갑주소의 transfer db에 저장
    await nftService.get_nft_moralis(address , 1);
    // 저장되지 않은 NFT 콜렉션 추가로 검색해 db에 저장
    await nftService.get_nft_moralis(address , 1);

  } catch (err) {
    console.log('Error >>', err);
  }
};


module.exports = {
  createUser,
  getUserbyWallet,
  getUserbyId,
  updateUser,
  checkNicknameDuplication,
};
