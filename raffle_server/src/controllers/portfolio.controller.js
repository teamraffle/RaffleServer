const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { nftService } = require('../services');


const get_portfolio = catchAsync(async (req, res, next) => {
  

  res.status(httpStatus.CREATED).send('res');

  
});

const test = catchAsync(async (req, res, next) => {
  

  res.status(httpStatus.CREATED).send('test');

  
});

module.exports = {
  get_portfolio,
  test,
};
