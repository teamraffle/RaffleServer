const Joi = require('joi');
const { ethWallet } = require('./custom.validation');

const login = {
  body: Joi.object().keys({
    address : Joi.string().required().custom(ethWallet),
    secret : Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    address : Joi.string().required().custom(ethWallet),
    refreshToken : Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    address : Joi.string().required().custom(ethWallet),
    refreshToken : Joi.string().required(),
  }),
};

module.exports = {
  login,
  logout,
  refreshTokens,
};
