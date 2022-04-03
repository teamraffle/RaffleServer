const UUID = (value, helpers) => {
  if (value.length != 36) {
    return helpers.message('Invalid ID');
  }
  //TODO 나중에 3765a161-a230-11ec-9e4b-a1145dc9a584 양식 맞는지도 체크
  return value;
};

// const password = (value, helpers) => {
//   if (value.length < 8) {
//     return helpers.message('password must be at least 8 characters');
//   }
//   if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
//     return helpers.message('password must contain at least 1 letter and 1 number');
//   }
//   return value;
// };

const ethWallet = (value, helpers) => {
  if (value.length != 42) {
    return helpers.message('Invalid hex number at address');
  }
  return value;
};

const ethWalletOrUUID = (value, helpers) => {
  if (value.length != 36 || value.length != 42) {
    return helpers.message('Invalid ID nor invalid hex number at address');
  }
  return value;
};

module.exports = {
  ethWallet,
  UUID,
  ethWalletOrUUID,
};
