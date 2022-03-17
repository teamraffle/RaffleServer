const Joi = require('joi');
const { ethWallet,UUID } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    address : Joi.string().required().custom(ethWallet),
    chain_id : Joi.number().integer().required(),
    nickname : Joi.string().required(),
    profile_pic : Joi.string(),
    email : Joi.string().allow(null, ''),
  }),
};

const getUserbyWallet = {
  query: Joi.object().keys({
    address : Joi.string().required().custom(ethWallet),
    chain_id : Joi.number().integer().required(),
  }),
};

const getUserbyID = {
  params: Joi.object().keys({
    user_id: Joi.string().required().custom(UUID)
  }),
};


const checkNickname = {
  query: Joi.object().keys({
    check_value : Joi.string().required(),
    chain_id : Joi.number().integer().required(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    user_id: Joi.string().required().custom(UUID)
  }),
  body: Joi.object().keys({
    nickname : Joi.string(),
    profile_pic : Joi.string(),
  }),
};

const deleteUser = {
  // params: Joi.object().keys({
  //   userId: Joi.string().custom(objectId),
  // }),
};

module.exports = {
  createUser,
  getUserbyID,
  getUserbyWallet,
  updateUser,
  checkNickname,
};
