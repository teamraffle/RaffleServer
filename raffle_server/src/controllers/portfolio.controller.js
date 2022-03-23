const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { portfolioService } = require('../services');

//모랄리스 nft되나 테스트
const test = catchAsync(async (req, res) => {
  const nftData = await portfolioService.get_moralis_nft("0xeaae7db5b77fc228bacbf58b787e4ff0885b146e",1);
  res.status(httpStatus.CREATED).send(nftData);
});

const opensea = catchAsync(async (req, res) => {
  const nftData = await portfolioService.get_nft_fp("0x06012c8cf97bead5deae237070f9587f8e7a266d",1);
  res.status(httpStatus.CREATED).send(nftData);
});

const slugsave = catchAsync(async (req, res) => {
  const nftData = await portfolioService.save_nft_slug("0x8b804fbd998f612c2b98fb81b06d993008d1bf09",1);
  res.status(httpStatus.CREATED).send(nftData);
});


const saveNFTTransactions = catchAsync(async (req, res) => {
  const nftTx = await portfolioService.save_nft_slug("0xA96e16Cdc8c47e1E1E754af62a36D0d4ac7B7c67",1);//예원지갑인듯
  // const nftTx = await portfolioService.getNFTTransaction("0xb8d6faf9f6b67a8c609d11e5099e0732e12cdc15",1);//고래지갑
  // 고래지갑 : 0x8b804fbd998f612c2b98fb81b06d993008d1bf09
  res.status(httpStatus.CREATED).send('res');
});

module.exports = {
  test,
  saveNFTTransactions,
  opensea,
  slugsave
};
