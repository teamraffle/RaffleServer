const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, nftService } = require('../services');

const create_user = catchAsync(async (req, res) => {
  const userId = await userService.create_user(req.body);
  res.status(httpStatus.CREATED).send(userId);

  await get_and_save_first_data(req.body);
});

const get_user_by_wallet = catchAsync(async (req, res) => {
  const userAndWallet = await userService.get_user_by_wallet(req.query);
  res.status(httpStatus.OK).send(userAndWallet);
});

const get_user_by_id = catchAsync(async (req, res) => {
  const userAndWallet = await userService.get_user_by_id(req.params);
  res.status(httpStatus.OK).send(userAndWallet);

});

const update_user = catchAsync(async (req, res) => {
  const user = await userService.update_user_by_id(req.params, req.body);
  res.status(httpStatus.OK).send(user);

});

const check_nickname_duplication = catchAsync(async (req, res) => {
  const ifTaken = await userService.check_nickname(req.query);
  res.status(httpStatus.OK).send(ifTaken);
});


const get_and_save_first_data = async (address) => {
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
  create_user,
  get_user_by_wallet,
  get_user_by_id,
  update_user,
  check_nickname_duplication,
};
