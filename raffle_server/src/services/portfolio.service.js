const httpStatus = require('http-status');
const { Portfolio } = require('../models');
const ApiError = require('../utils/ApiError');
const axios = require('axios');
const config = require('../config/config');
const user_info =  async(query)=>{
    const user_id_or_address=query.user_id_or_address;
    const nickname = await Portfolio.get_user(query);
    return nickname;

}

module.exports = {
    user_info
};
