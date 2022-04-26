const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, nftService, portfolioService } = require('../services');

const create_user = catchAsync(async (req, res) => {
  const userId = await userService.create_user(req.body);
  res.status(httpStatus.CREATED).send(userId);

  const is_worthy_wallet = await get_and_save_first_data(req.body.address, req.body.chain_id);
  if(is_worthy_wallet){
    await analyze_first_data(req.body.address, req.body.chain_id);

    //랭킹
  }

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
  let final_coll_set;
  let has_transfers = true;
  let is_worthy_wallet = true;
  try {
    // 소유중인 NFT 콜렉션의 정보를 db에 저장
    let {has_nft_now, coll_set, slug_set} = await nftService.get_nftcoll_opensea(address, chain_id);
    
    if(has_nft_now){
      // 소유중인 nft 콜렉션의 바닥값 가져옴
      const fp_total = await nftService.get_nft_fp(slug_set);
      // 소유중인 NFT 각각의 정보 가져옴  //TODO 이건 사실 병렬이 맞음
      await nftService.get_nft_moralis(address , chain_id);
      // 지갑주소의 transfer을 db에 저장
      let transfer_coll_set = await nftService.get_all_NFT_transfers(address, chain_id, fp_total);
      // 트랜스퍼 콜렉션 - 지갑주소 nft 콜렉션 = 무중복 세트
      let coll_set_duplicate_removed = nftService.remove_SetA_from_SetB(coll_set, transfer_coll_set);
      // db에 무중복 세트가 있는지 확인
      final_coll_set = await nftService.check_collection_exists(coll_set_duplicate_removed);
      // NFT콜렉션 검색해 디비에 저장
      await nftService.get_and_save_nftcoll(final_coll_set); 
    } else {
      // 지갑주소의 transfer을 db에 저장
      let transfer_coll_set = await nftService.get_all_NFT_transfers_no_fp(address, chain_id);
      // 저장해야할 콜렉션 리스트
      final_coll_set = transfer_coll_set;


      if(final_coll_set.size >1){
        // 이미 팔아버려서 저장되지 않은 NFT 콜렉션 추가로 검색해 db에 저장
        await nftService.get_and_save_nftcoll(final_coll_set); 
      } else {
        has_transfers = false;
      }
      
      if(!has_nft_now && !has_transfers){
        is_worthy_wallet = false;
      }

    }

    return is_worthy_wallet;
    
    //console.log("FINISHED")


  } catch (err) {
    console.log('Error >>', err);
  }
};

const analyze_first_data = async (wallet, chain_id) => {
  try {
    await portfolioService.user_info(wallet, chain_id);

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
