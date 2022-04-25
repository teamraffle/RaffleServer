const httpStatus = require('http-status');
const { Portfolio } = require('../models');
const ApiError = require('../utils/ApiError');
const axios = require('axios');
const config = require('../config/config');

//포폴저장할때씀
const user_info =  async(wallet,chain_id)=>{
  
    const portfolio_user_data = await Portfolio.save_portfolio(wallet,chain_id);
    if(!portfolio_user_data){
        return false;
    }else{
        return portfolio_user_data;
    }
}

const get_portfolio = async(query)=>{

    const portfolio_user_data = await Portfolio.get_portfolio(query);
    if(!portfolio_user_data){
        return portfolio_user_data;
    }else{
        return portfolio_user_data;
    }

}

const get_nft = async(query)=>{

    const nft_data = await Portfolio.get_nft(query);
    if(!nft_data){
        throw new ApiError(httpStatus.NOT_FOUND, 'No nft found');
    }else{
        return nft_data;
    }

}
const get_activity = async(query)=>{

    const portfolio_user_data = await Portfolio.get_portfolio_activity(query);
    if(!portfolio_user_data){
        throw new ApiError(httpStatus.NOT_FOUND, 'No activity found');
    }else{
        return portfolio_user_data;
    }
 

}
module.exports = {
    user_info,
    get_portfolio,
    get_nft,
    get_activity,
};
