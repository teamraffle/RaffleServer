const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, nftService } = require('../services');

const create_user = catchAsync(async (req, res) => {
  const userId = await userService.create_user(req.body);
  res.status(httpStatus.CREATED).send(userId);

  await get_and_save_first_data(req.body.address, req.body.chain_id);
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


const get_and_save_first_data = async (address, chain_id) => {
  try {
    
    // 지갑주소의 NFT 콜렉션 db에 저장
    const coll_set = await nftService.get_nftcoll_opensea(address, chain_id);
    // 지갑주소의 NFT db에 저장
    await nftService.get_nft_moralis(address , chain_id);
    // 지갑주소의 transfer db에 저장
    let transfer_coll_set = await nftService.get_all_NFT_transfers(address, chain_id);
    // 트랜스퍼 콜렉션 - 지갑주소 nft 콜렉션 = 무종복 세트
    console.log(coll_set);
    console.log(transfer_coll_set);

    let coll_set_duplicate_removed = nftService.remove_SetA_from_SetB(coll_set, transfer_coll_set);
    // db에 무종복 세트가 있는지 확인
    const missingAddress = await nftService.check_collection_exists(coll_set_duplicate_removed);
    // 저장되지 않은 NFT 콜렉션 추가로 검색해 db에 저장
    await nftService.get_nftcoll_moralis(missingAddress);


  } catch (err) {
    console.log('Error >>', err);
  }
};

const test = catchAsync(async (req, res) => {
  console.log(await nftService.get_collection_opensea('0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'));
  res.status(httpStatus.OK).send('open');
});




module.exports = {
  create_user,
  get_user_by_wallet,
  get_user_by_id,
  update_user,
  check_nickname_duplication,
  test,
};
