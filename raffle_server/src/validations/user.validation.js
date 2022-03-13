const Joi = require('joi');
const { ethWallet } = require('./custom.validation');

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

const getUser = {
  // params: Joi.object().keys({
  //   userId: Joi.string().custom(objectId),
  // }),
};

const updateUser = {
  // params: Joi.object().keys({
  //   userId: Joi.required().custom(objectId),
  // }),
  // body: Joi.object()
  //   .keys({
  //     email: Joi.string().email(),
  //     password: Joi.string().custom(password),
  //     name: Joi.string(),
  //   })
  //   .min(1),
};

const deleteUser = {
  // params: Joi.object().keys({
  //   userId: Joi.string().custom(objectId),
  // }),
};

module.exports = {
  createUser,
  // getUserbyID,
  getUserbyWallet,
  // updateUser,
};
