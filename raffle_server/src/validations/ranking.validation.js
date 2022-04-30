const Joi = require('joi');
const { ethWalletOrUUID } = require('./custom.validation');

const getRanking = {
  params: Joi.object().keys({
    page: Joi.number().integer(),
    limit: Joi.number().integer(),
  }),
};

module.exports = {
    getRanking
};
