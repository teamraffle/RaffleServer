// const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const { data } = require('../../src/config/logger');
const User = require('../../src/models/user.model');

// Set data

faker.seed(0);
const zero = faker.datatype.number();
faker.seed('eead9b11-b7f8-11ec-8244-a5e121af7480');
const uuid_wallet = faker.datatype.uuid();
faker.seed('0xB999D5cb1868368766c41c0F455a9243B2688CF3');
const address = faker.datatype.string();

const userOne = {
  user_id: faker.datatype.uuid(),
  wallet_id : uuid_wallet,
  nickname: faker.name.findName(),
  profile_pic: faker.image.avatar(),
  status: zero,
  email: faker.internet.email().toLowerCase(),
  create_timestamp :faker.date.past() ,
  update_timestamp : faker.date.past()
};

const walletOne = {
    wallet_id : uuid_wallet,
    address : address, 
    create_timestamp : faker.date.past()
}

const insertUser = async (user, chain_id) => {
  await User.create(user, chain_id);
};

module.exports = {
  userOne,
  insertUser,
  walletOne,
};
