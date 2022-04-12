const httpStatus = require('http-status');
const { Portfolio } = require('../models');
const ApiError = require('../utils/ApiError');
const axios = require('axios');
const config = require('../config/config');

const user_info =  async(wallet,chain_id)=>{
  
    const portfolio_user_data = await Portfolio.get_user(wallet,chain_id);
    if(!portfolio_user_data){
        throw new ApiError(httpStatus.CONFLICT, 'No user found');
    }else{
        return portfolio_user_data;
    }
}

const get_user_info = async(query)=>{

    const portfolio_user_data = await Portfolio.get_portfolio(query);
    if(!portfolio_user_data){
        throw new ApiError(httpStatus.NOT_FOUND, 'No user found');
    }else{
        return portfolio_user_data;
    }
 

}

module.exports = {
    user_info,
    get_user_info
};
