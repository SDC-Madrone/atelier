const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');

describe('GET /questions', () => {
  describe('Errant responses', () => {
    it('returns a status code of 400 if no product_id is provided', (done) => {
      request(app)
        .get('/qa/questions')
        .end((err, res) => {
          if (err) return err;
          expect(res.statusCode).to.equal(400);
          return done();
        });
    }).timeout(10000);

    it('returns a status code of 404 if an invalid product_id is provided', (done) => {
      request(app)
        .get('/qa/questions')
        .query({ product_id: 120000000 })
        .end((err, res) => {
          if (err) return err;
          expect(res.statusCode).to.equal(404);
          done();
        });
    });
  });

  // product id ranges from 1 to 1000011
  describe('Valid product id', () => {
    let productId;
    let response;

    before((done) => {
      productId = Math.floor(Math.random() * (1000011 - 1 + 1) + 1);
      console.log('Testing product_id: ', productId);
      request(app)
        .get('/qa/questions')
        .query({ product_id: productId })
        .end((err, res) => {
          if (err) return err;
          response = res;
          return done();
        });
    });

    it('returns a status code of 200 if a valid product_id is provided', () => {
      expect(response.statusCode).to.equal(200);
    });

    it('responds with a json object', () => {
      expect(response.headers['content-type']).to.include('application/json');
      expect(response.body).to.be.an('object');
    });

    it('responds with the correct properties at the top-level', () => {
      expect(response.body).to.have.property('product_id', `${productId}`);
      expect(response.body).to.have.property('results');
      expect(response.body.results).to.be.an('array');
    });
  });
});
