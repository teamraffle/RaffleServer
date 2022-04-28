const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { RankingService } = require('../services');


const make_rank = catchAsync(async (req,res) => {
  const rank = await RankingService.make_rank(req,res);
  res.status(httpStatus.OK).send(rank);
});

const get_rank = catchAsync(async (req,res) => {
  const rank = await RankingService.get_rank(req,res);
  res.status(httpStatus.OK).send(rank);
});


module.exports = {
  make_rank,
  get_rank
};
