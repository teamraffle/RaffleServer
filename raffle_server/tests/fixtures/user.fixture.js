// const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const { data } = require('../../src/config/logger');

// Set data
const uuid_wallet = 'eead9b11-b7f8-11ec-8244-a5e121af7480';


const userSmall = {
  user_id: faker.datatype.uuid(),
  wallet_id : '',
  nickname: faker.name.findName(),
  profile_pic: faker.image.avatar(),
  status: 0,
  email: faker.internet.email().toLowerCase(),
  create_timestamp :faker.date.past() ,
  update_timestamp : faker.date.past(),
  wallet : {
    wallet_id : '',
    address : '0xA96e16Cdc8c47e1E1E754af62a36D0d4ac7B7c67', //예원
    create_timestamp : faker.date.past()
  }
};

const userEnormous = {
  user_id: faker.datatype.uuid(),
  wallet_id : '',
  nickname: faker.name.findName(),
  profile_pic: faker.image.avatar(),
  status: 0,
  email: faker.internet.email().toLowerCase(),
  create_timestamp :faker.date.past() ,
  update_timestamp : faker.date.past(),
  wallet : {
    wallet_id : uuid_wallet,
    address : '0xA96e16Cdc8c47e1E1E754af62a36D0d4ac7B7c67', //예원
    create_timestamp : faker.date.past()
  }
};

const userEmpty = {
  user_id: faker.datatype.uuid(),
  wallet_id : '',
  nickname: faker.name.findName(),
  profile_pic: faker.image.avatar(),
  status: 0,
  email: faker.internet.email().toLowerCase(),
  create_timestamp :faker.date.past() ,
  update_timestamp : faker.date.past(),
  wallet : {
    wallet_id : uuid_wallet,
    address : '0xB999D5cb1868368766c41c0F455a9243B2688CF3', 
    create_timestamp : faker.date.past()
  }
};

const userTransferOnly = {  
  user_id: faker.datatype.uuid(),
  wallet_id : '',
  nickname: faker.name.findName(),
  profile_pic: faker.image.avatar(),
  status: 0,
  email: faker.internet.email().toLowerCase(),
  create_timestamp :faker.date.past() ,
  update_timestamp : faker.date.past(),
  wallet : {
    wallet_id : uuid_wallet,
    address : '0x943b99914Ec2C88d8D2C65d0837d9C0F9969c391', 
    create_timestamp : faker.date.past()
  }
};


module.exports = {
  userSmall,
  userEmpty,
  userTransferOnly,
  userEnormous,
};
