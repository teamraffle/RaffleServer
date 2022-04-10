// const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const { data } = require('../../src/config/logger');
const User = require('../../src/services/user.service');

// Set data
const uuid_wallet = 'eead9b11-b7f8-11ec-8244-a5e121af7480';
const address = '0xB999D5cb1868368766c41c0F455a9243B2688CF3';
const address2 = '0xA96e16Cdc8c47e1E1E754af62a36D0d4ac7B7c67';

const userSmall = {
  user_id: faker.datatype.uuid(),
  wallet_id : uuid_wallet,
  nickname: faker.name.findName(),
  profile_pic: faker.image.avatar(),
  status: 0,
  email: faker.internet.email().toLowerCase(),
  create_timestamp :faker.date.past() ,
  update_timestamp : faker.date.past()
};

const userEmpty = {
  user_id: faker.datatype.uuid(),
  wallet_id : uuid_wallet,
  nickname: faker.name.findName(),
  profile_pic: faker.image.avatar(),
  status: 0,
  email: faker.internet.email().toLowerCase(),
  create_timestamp :faker.date.past() ,
  update_timestamp : faker.date.past()
};

const walletEmpty = {
    wallet_id : uuid_wallet,
    address : address, 
    create_timestamp : faker.date.past()
}

const walletSmall = {
  wallet_id : uuid_wallet,
  address : address2, 
  create_timestamp : faker.date.past()
}

const insertUser = async (user, chain_id) => {
  await User.create_user(user, chain_id);
};

module.exports = {
  userSmall,
  userEmpty,
  walletEmpty,
  walletSmall,
  insertUser,
};
