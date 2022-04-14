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
  res.status(httpStatus.OK).send(portfolio);
});

const test = catchAsync(async (req, res) => {
  res.status(httpStatus.CREATED).send('test');
});

module.exports = {
  get_portfolio,
  get_nft,
  test,
  get_activity,
};
