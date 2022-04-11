const request = require('supertest');
const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { User, WalletEth } = require('../../src/models');
const { userSmall } = require('../fixtures/user.fixture');
// const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Portfolio routes', () => {
    
    // let samplePortfolio = {
    //     wallet_address : '0xB999D5cb1868368766c41c0F455a9243B2688CF3',
    //     nft_hodings: 0,
    //     collections_holdings:0,
    //     av_holding_period:43.25,
    //     most_collection_name: faker.name.findName(),
    //     most_collection_icon: faker.image.avatar(),
    //     est_market_value:0.053,
    //     holding_volume:0,
    //     earnings_rate:0,
    //     total_gas_fee: 1,
    //     buy_volume: 0.076,
    //     sell_volume: 0.34,
    //     create_timestamp: "2022-04-11 12:30:01.000"
    // }
    beforeAll(async () => {
        input = {
            chain_id : 1,
            address : userSmall.wallet.address,
            nickname : userSmall.nickname,
            email: userSmall.email,
            profile_pic : userSmall.profile_pic
        }
        const pre = await request(app)
            .post('/v1/users')
            .send(input)
            .expect(httpStatus.CREATED);
        userSmall.user_id = pre.body.user_id;
        
      });

    describe('GET /v1/portfolios/basic', () => {
      test('should return 200 and return portfolio. Search with ADDRESS', async () => {
        //8초는 기다려야 포폴완성됨
        await new Promise((resolve) => setTimeout(() => resolve(true), 8000));

        const res = await request(app)
          .get('/v1/portfolios/basic')
          .set('Content-Type', "application/json")
          .query(
              {
                chain_id : 1,
                user_id_or_address: userSmall.wallet.address,
              }
          )
          .send()
          .expect(httpStatus.OK);
        
          expect(res.body).toEqual({
            updated_at: expect.anything(),
            user: {
              nickname: userSmall.nickname,
              user_id: userSmall.user_id,
              profile_pic: userSmall.profile_pic
            },
            portfolio: {
              wallet_address: userSmall.wallet.address,
              nft_holdings: expect.anything(),
              collections_holdings: expect.anything(),
              av_holding_period: expect.anything(),
              most_collection_name: expect.anything(),
              most_collection_icon: expect.anything(),
              est_market_value: expect.anything(),
              holding_volume: expect.anything(),
              earnings_rate: expect.anything(),
              total_gas_fee: expect.anything(),
              buy_volume: expect.anything(),
              sell_volume: expect.anything()
            }
          });
         
      });
  
    //   test('should return 404 because no data', async () => {
    //     test_user_id = await User.create(user, wallet_id);
    //     await request(app)
    //       .get('/v1/register/nickname')
    //       .query(
    //           {
    //             chain_id : 1,
    //             check_value: user.nickname,
    //           }
    //       )
    //       .send()
    //       .expect(httpStatus.CONFLICT);
    //   });
  
      
  
    });

    afterAll(() => {
            //DB에 userSmall 관련 데이터 삭제
        //지갑테이블에서 삭제
        WalletEth.deleteByAddr(userSmall.wallet.address);
        //user테이블에서 삭제
        User.delete_user_only(userSmall.user_id);
        //nft, 바닥, 포폴은 삭제안함 어차피 유닛에서도 테스트함
      });
   
  
  });