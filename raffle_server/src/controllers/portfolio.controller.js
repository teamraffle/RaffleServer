const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { portfolioService } = require('../services');

//모랄리스 nft되나 테스트
const test = catchAsync(async (req, res) => {
  const nftData = await portfolioService.get_moralis_nft("0xc310e760778ecbca4c65b6c559874757a4c4ece0",1);
  res.status(httpStatus.CREATED).send(nftData);
});

const opensea = catchAsync(async (req, res) => {
  const nftData = await portfolioService.get_nft_fp("doodles-official",1);
  res.status(httpStatus.CREATED).send(nftData);
});


const saveNFTTransactions = catchAsync(async (req, res) => {
  const nftTx = await portfolioService.getAllNFTTransfers("0xA96e16Cdc8c47e1E1E754af62a36D0d4ac7B7c67",1);//예원지갑인듯
  // const nftTx = await portfolioService.getNFTTransaction("0xb8d6faf9f6b67a8c609d11e5099e0732e12cdc15",1);//고래지갑
  // 고래지갑 : 0x8b804fbd998f612c2b98fb81b06d993008d1bf09
  res.status(httpStatus.CREATED).send('res');
});

module.exports = {
  test,
  saveNFTTransactions,
  opensea
};
