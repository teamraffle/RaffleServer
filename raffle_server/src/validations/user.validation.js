const Joi = require('joi');
const { ethWallet,UUID } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    address : Joi.string().required().custom(ethWallet),
    chainId : Joi.number().integer().required(),
    nickname : Joi.string().required(),
    profilePic : Joi.string(),
    email : Joi.string().allow(null, ''),
  }),
};

const getUserbyWallet = {
  query: Joi.object().keys({
    address : Joi.string().required().custom(ethWallet),
    chainId : Joi.number().integer().required(),
  }),
};

const getUserbyID = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(UUID)
  }),
};


const getUser = {
  // params: Joi.object().keys({
  //   userId: Joi.string().custom(objectId),
  // }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(UUID)
  }),
  body: Joi.object().keys({
    nickname : Joi.string(),
    profilePic : Joi.string(),
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
};
