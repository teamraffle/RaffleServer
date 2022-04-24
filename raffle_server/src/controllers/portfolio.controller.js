const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { nftService, portfolioService } = require('../services');

const get_activity = catchAsync(async (req, res) => {
  const activity = await portfolioService.get_activity(req.query);
  res.status(httpStatus.OK).send(activity);
});

const get_nft = catchAsync(async (req, res) => {
  const nft_values = await portfolioService.get_nft(req.query);
  res.status(httpStatus.OK).send(nft_values);
});

const get_portfolio = catchAsync(async (req, res) => {
  const portfolio = await portfolioService.get_portfolio(req.query);
  if(!portfolio){
    const err_msg = {
      'code': 404,
      'message': 'No portfolio found'
    };
    res.status(httpStatus.NOT_FOUND).send(err_msg);

    console.log('new portfolio 만드는중..');
    const is_worthy_wallet = await get_and_save_first_data(req.query.address, 1);
    if(is_worthy_wallet){
      await analyze_first_data(req.query.address, 1);
    }
  }else{
    res.status(httpStatus.OK).send(portfolio);
  }
});

const test = catchAsync(async (req, res) => {
  res.status(httpStatus.CREATED).send('test');
});



const get_and_save_first_data = async (address, chain_id) => {
  let final_coll_set;
  let has_transfers = true;
  let is_worthy_wallet = true;
  try {
    // 소유중인 NFT 콜렉션의 정보를 db에 저장
    let {has_nft_now, coll_set, slug_set} = await nftService.get_nftcoll_opensea(address, chain_id);
    console.log(has_nft_now);
    
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
      const util = require('util')
      console.log(util.inspect(transfer_coll_set, false, null, true /* enable colors */))
   
      if(transfer_coll_set.size >0){
      
        // 이미 팔아버려서 저장되지 않은 NFT 콜렉션 추가로 검색해 db에 저장
        await nftService.get_and_save_nftcoll(transfer_coll_set); 

      } else {
        has_transfers = false;
      }
      
      if(!has_nft_now && !has_transfers){
        is_worthy_wallet = false;
      }
    }
    return is_worthy_wallet;
    
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
  get_portfolio,
  get_nft,
  test,
  get_activity,
};
