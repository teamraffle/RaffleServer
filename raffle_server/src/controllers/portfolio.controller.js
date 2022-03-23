const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { portfolioService } = require('../services');

//모랄리스 nft되나 테스트
const test = catchAsync(async (req, res) => {
  const nftData = await portfolioService.get_moralis_nft("0xA96e16Cdc8c47e1E1E754af62a36D0d4ac7B7c67",1);
  res.status(httpStatus.CREATED).send(nftData);
});

const opensea = catchAsync(async (req, res) => {
  const nftData = await portfolioService.get_nft_fp("doodles-official",1);
  res.status(httpStatus.CREATED).send(nftData);
});


const saveNFTTransactions = catchAsync(async (req, res, next) => {
  
  res.status(httpStatus.CREATED).send('res');

  const nftCollectionSet = await portfolioService.getAllNFTTransfers("0xA96e16Cdc8c47e1E1E754af62a36D0d4ac7B7c67",1);//예원지갑인듯
  // const nftCollectionSet = await portfolioService.getAllNFTTransfers("0xb8d6faf9f6b67a8c609d11e5099e0732e12cdc15",1);//고래지갑
  // 고래지갑2 : 0x8b804fbd998f612c2b98fb81b06d993008d1bf09
    // console.log(nftCollectionSet);

  //TODO 트랜스퍼 set 목록에서 이미 저장한 set목록 빼기
          // https://www.tutorialspoint.com/Subtract-two-Sets-in-Javascript
  //우리 DB에서 해당 주소 콜렉션 있나 확인
  const missingAddress = await portfolioService.ifCollectionExists(nftCollectionSet);
  console.log(missingAddress);

  //없는 콜렉션 오픈씨에서 추가
  
});

module.exports = {
  test,
  saveNFTTransactions,
  opensea
};
