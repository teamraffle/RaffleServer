const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { portfolioService } = require('../services');
const axios = require('axios');
const test = catchAsync(async (req, res) => {
    axios.get('https://deep-index.moralis.io/api/v2/0x13c150622405bf2b5759663ce811b2b87f053601/nft?chain=eth&format=decimal',{
        method: 'GET',
        headers: {
          'x-api-key': 'ob3tEdcftYbkpUiInzVe2pn2yO7ncdqZOomeymK2f69lIjFrbd4b3zyGLOHwylEr'
        }
      }) .then((Response)=>{
        res.status(httpStatus.OK).send(Response.data);
      }) 
      .catch((Error)=>{console.log(Error)})


});


// const deleteUser = catchAsync(async (req, res) => {
//   await userService.deleteUserById(req.params.userId);
//   res.status(httpStatus.NO_CONTENT).send();
// });

module.exports = {
  test
};
