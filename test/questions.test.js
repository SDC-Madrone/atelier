/* eslint-disable no-undef */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');

describe('GET /questions', function () {
  this.timeout(10000);

  describe('Errant requests', () => {
    it('Returns a status code of 400 if no product_id is provided', (done) => {
      request(app)
        .get('/qa/questions')
        .end((err, res) => {
          if (err) return err;
          expect(res.statusCode).to.equal(400);
          return done();
        });
    });

    // product id ranges from 1 to 1000011
    it('Returns a status code of 200, but an empty results array for product_id with no questions', (done) => {
      request(app)
        .get('/qa/questions')
        .query({ product_id: 589406 })
        .end((err, res) => {
          if (err) return err;
          expect(res.statusCode).to.equal(200);
          expect(res.headers['content-type']).to.include('application/json');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('product_id', '589406');
          expect(res.body).to.have.property('results').that.is.an('array').that
            .is.empty;
          return done();
        });
    });
  });

  describe('Valid product id', () => {
    // product id ranges from 1 to 1000011
    const productId = Math.floor(Math.random() * (1000011 - 1 + 1) + 1);
    let response;

    before((done) => {
      request(app)
        .get('/qa/questions')
        .query({ product_id: productId })
        .end((err, res) => {
          if (err) return err;
          response = res;
          return done();
        });
    });

    it('Returns a status code of 200', () => {
      expect(response.statusCode).to.equal(200);
    });

    it('Responds with a json object', () => {
      expect(response.headers['content-type']).to.include('application/json');
      expect(response.body).to.be.an('object');
    });

    it('Responds with the correct properties and types at the top-level', () => {
      expect(response.body).to.have.property('product_id', `${productId}`);
      expect(response.body).to.have.property('results');
      expect(response.body.results).to.be.an('array');
    });

    describe('With page and count', () => {
      const page = 1;
      const count = 3;
      before((done) => {
        request(app)
          .get('/qa/questions')
          .query({ product_id: productId, page, count })
          .end((err, res) => {
            if (err) return err;
            response = res;
            return done();
          });
      });

      it('Returns a status code of 200', () => {
        expect(response.statusCode).to.equal(200);
      });

      it('Responds with a json object', () => {
        expect(response.headers['content-type']).to.include('application/json');
        expect(response.body).to.be.an('object');
      });

      it('responds with the correct properties at the top-level, including page and count', () => {
        expect(response.body).to.have.property('product_id', `${productId}`);
        expect(response.body).to.have.property('page', page);
        expect(response.body).to.have.property('count', count);
        expect(response.body).to.have.property('results');
        expect(response.body.results).to.be.an('array');
      });

      it('responds with the correct number of results based on count parameter', () => {
        expect(response.body.results).to.have.lengthOf.at.most(count);
      });
    });
  });
});

// TO DO: add additional tests to confirm it returns the right nested shape, as well as the correct results, not just shape

describe('GET /questions/:question_id/answers', function () {
  this.timeout(10000);

  describe('Errant responses', () => {
    it('Returns a status code of 404 if an invalid question_id is provided', (done) => {
      request(app)
        .get(`/qa/questions/12000000/answers`)
        .end((err, res) => {
          if (err) return err;
          expect(res.statusCode).to.equal(404);
          return done();
        });
    });
  });

  describe('Valid product id', () => {
    // product id ranges from 1 to  3518963
    const questionId = Math.floor(Math.random() * (3518963 - 1 + 1) + 1);
    console.log('questionId: ', questionId);
    let response;

    before((done) => {
      request(app)
        .get(`/qa/questions/${questionId}/answers`)
        .end((err, res) => {
          if (err) return err;
          response = res;
          return done();
        });
    });

    it('Returns a status code of 200', () => {
      expect(response.statusCode).to.equal(200);
    });

    it('Responds with a json object', () => {
      expect(response.headers['content-type']).to.include('application/json');
      expect(response.body).to.be.an('object');
    });

    it('Responds with the correct properties at the top-level with the right product id', () => {
      expect(response.body).to.have.property('question', `${questionId}`);
      expect(response.body).to.have.property('results');
      expect(response.body.results).to.be.an('array');
    });

    describe('With page and count', () => {
      const page = 1;
      const count = 3;
      before((done) => {
        request(app)
          .get(`/qa/questions/${questionId}/answers`)
          .query({ page, count })
          .end((err, res) => {
            if (err) return err;
            response = res;
            return done();
          });
      });

      it('Returns a status code of 200', () => {
        expect(response.statusCode).to.equal(200);
      });

      it('Responds with a json object', () => {
        expect(response.headers['content-type']).to.include('application/json');
        expect(response.body).to.be.an('object');
      });

      it('responds with the correct properties at the top-level, including page and count', () => {
        expect(response.body).to.have.property('question', `${questionId}`);
        expect(response.body).to.have.property('page', page);
        expect(response.body).to.have.property('count', count);
        expect(response.body).to.have.property('results');
        expect(response.body.results).to.be.an('array');
      });

      it('responds with the correct number of results based on count parameter', () => {
        expect(response.body.results).to.have.lengthOf.at.most(count);
      });
    });
  });
});
