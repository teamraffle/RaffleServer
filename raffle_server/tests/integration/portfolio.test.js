const request = require('supertest');
const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { User, WalletEth } = require('../../src/models');
const { userSmall } = require('../fixtures/user.fixture');
// const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe.skip('Portfolio routes', () => {
    
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
        test('should return 404 because no data', async () => {

            await request(app)
              .get('/v1/portfolios/basic')
              .query(
                  {
                    chain_id : 1,
                    address: '0xccce16Cdc8c47e1E1E7ccaf62a36D0d4ac7B7ccc',
                  }
              )
              .send()
              .expect(httpStatus.NOT_FOUND);
          });


        test('should return 200 and return portfolio. Search with ADDRESS', async () => {
            //8초는 기다려야 포폴완성됨
            await new Promise((resolve) => setTimeout(() => resolve(true), 8000));

            const res = await request(app)
            .get('/v1/portfolios/basic')
            .set('Content-Type', "application/json")
            .query(
                {
                    chain_id : 1,
                    address: userSmall.wallet.address,
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