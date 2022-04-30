const httpStatus = require('http-status');
const { Ranking } = require('../models');
const ApiError = require('../utils/ApiError');
const axios = require('axios');
const config = require('../config/config');

//포폴저장할때씀
const make_rank =  async()=>{
  
    const user_ranking = await Ranking.make_ranking();
    if(!user_ranking){
        throw new ApiError(httpStatus.CONFLICT, 'No Data');
    }else{
        return user_ranking;
    }
}

// 랭킹 불러오기
const get_rank =  async(query)=>{

    const user_ranking = await Ranking.get_ranking(query);
    if(!user_ranking){
        throw new ApiError(httpStatus.CONFLICT, 'No Data');
    }else{
        return user_ranking;
    }
}



module.exports = {
    make_rank,
    get_rank
};
