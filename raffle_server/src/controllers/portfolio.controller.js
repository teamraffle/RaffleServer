const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { nftService,portfolioService } = require('../services');


const get_portfolio = catchAsync(async (req, res, next) => {
  
  //TDOO address 일때만 구현됐음
  const portfolio= await portfolioService.get_portfolio(req.query);
  res.status(httpStatus.OK).send(portfolio);

  
});

const get_activity = catchAsync(async (req, res, next) => {
  
  //TDOO address 일때만 구현됐음
  const activity= await portfolioService.get_activity(req.query);
  res.status(httpStatus.OK).send(activity);

  
});

const test = catchAsync(async (req, res, next) => {
  res.status(httpStatus.CREATED).send('test');
});

const get_nft = catchAsync(async (req, res, next) => {
  const nft_values= await portfolioService.get_nft(req.query);
  res.status(httpStatus.OK).send(nft_values);
});

module.exports = {
  get_portfolio,
  get_nft,
  test,
  get_activity
};
