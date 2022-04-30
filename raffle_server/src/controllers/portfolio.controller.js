const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { nftService, portfolioService } = require('../services');
const { Ranking } = require('../models');
const { userController } = require('../controllers');
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
    const is_worthy_wallet = await userController.get_and_save_first_data(req.query.address, 1);
    if(is_worthy_wallet){
      await analyze_first_data(req.query.address, 1);
      await Ranking.notuser_make_ranking();
    }
  }else{
    res.status(httpStatus.OK).send(portfolio);
  }
});

const test = catchAsync(async (req, res) => {
  res.status(httpStatus.CREATED).send('test');
});


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
