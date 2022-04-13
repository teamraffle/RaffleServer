const Joi = require('joi');
const { ethWalletOrUUID } = require('./custom.validation');

const getPortfolio = {
  query: Joi.object().keys({
    address: Joi.string().required().custom(ethWalletOrUUID),
    chain_id : Joi.number().required().integer(),
    offset: Joi.number().integer(),
    limit: Joi.number().integer(),
    cursor: Joi.string(),
  }),
};


const activity = {
  query: Joi.object().keys({
    address: Joi.string().required().custom(ethWalletOrUUID),
    chain_id : Joi.number().required().integer(),
    offset: Joi.number().integer(),
    limit: Joi.number().integer(),
    cursor: Joi.string(),
  }),
};
module.exports = {
  getPortfolio,
  activity
};
