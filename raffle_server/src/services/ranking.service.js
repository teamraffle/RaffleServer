const httpStatus = require('http-status');
const { Ranking } = require('../models');
const ApiError = require('../utils/ApiError');
const axios = require('axios');
const config = require('../config/config');

//포폴저장할때씀
const make_rank =  async(page,limit)=>{
  
    const user_ranking = await Ranking.make_ranking(page,limit);
    if(!user_ranking){
        throw new ApiError(httpStatus.CONFLICT, 'No Data');
    }else{
        return user_ranking;
    }
}



module.exports = {
    make_rank
};
