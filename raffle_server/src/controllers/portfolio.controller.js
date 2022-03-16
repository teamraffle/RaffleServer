const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { portfolioService } = require('../services');

//모랄리스 nft되나 테스트
const test = catchAsync(async (req, res) => {
  const nftData = await portfolioService.get_moralis_nft();
  res.status(httpStatus.CREATED).send(nftData);
});


const saveNFTTransactions = catchAsync(async (req, res) => {
  const nftTx = await portfolioService.getNFTTransaction("0xb8d6faf9f6b67a8c609d11e5099e0732e12cdc15",1);
  res.status(httpStatus.CREATED).send('res');
});

module.exports = {
  test,
  saveNFTTransactions,
};
