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
    const productId = Math.floor(Math.random() * (1000011 - 1 + 1) + 1);
    console.log('productId: ', productId);
    let response;
    let results;

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

    it('Responds with the correct product_id', () => {
      expect(response.body).to.have.property('product_id', `${productId}`);
    });

    it('Includes an array of results', () => {
      expect(response.body).to.have.property('results').that.is.an('array');
      results = response.body.results;
    });

    it('Includes question_id for all results', () => {
      const numberCheck = results.map(
        (question) =>
          'question_id' in question && typeof question.question_id === 'number'
      );
      expect(numberCheck).to.not.contain(false);
    });

    it('Includes question_body for results', () => {
      const bodyCheck = results.map(
        (question) =>
          'question_body' in question &&
          typeof question.question_body === 'string'
      );
      expect(bodyCheck).to.not.contain(false);
    });

    it('Includes question_date for results', () => {
      const dateReg =
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
      const dateCheck = results.map(
        (question) =>
          'question_date' in question &&
          typeof question.question_date === 'string' &&
          dateReg.test(question.question_date)
      );
      expect(dateCheck).to.not.contain(false);
    });

    it('Includes askerName for results', () => {
      const askerCheck = results.map(
        (question) =>
          'asker_name' in question && typeof question.asker_name === 'string'
      );
      expect(askerCheck).to.not.contain(false);
    });

    it('Includes question_helpfulness for results', () => {
      const helpfulnessCheck = results.map(
        (question) =>
          'question_helpfulness' in question &&
          typeof question.question_helpfulness === 'number'
      );
      expect(helpfulnessCheck).to.not.contain(false);
    });

    it('Includes reported for results, which should be false', () => {
      const reportedTest = results.map(
        (question) =>
          'reported' in question &&
          typeof question.reported === 'boolean' &&
          !question.reported
      );
      expect(reportedTest).to.not.contain(false);
    });

    describe('Answers', () => {
      let answers;

      it('Includes answers for results', () => {
        const answersTest = results.map(
          (question) =>
            'answers' in question && typeof question.answers === 'object'
        );
        expect(answersTest).to.not.contain(false);
        answers = results.map((question) => question.answers);
      });

      it('Key of each answer should be same as answer id', () => {
        const idTest = answers.map((question) =>
          Object.keys(question).reduce((prev, curr) => {
            if (!prev) return false;
            return curr === question[curr].id.toString();
          }, true)
        );
        expect(idTest).to.not.contain(false);
      });

      it('Includes a body for all answers', () => {
        const bodyTest = answers.map((question) =>
          Object.keys(question).reduce((prev, curr) => {
            if (!prev) return false;
            return (
              'body' in question[curr] &&
              typeof question[curr].body === 'string'
            );
          }, true)
        );
        expect(bodyTest).to.not.contain(false);
      });

      it('Includes a date for all answers', () => {
        const dateReg =
          /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
        const dateTest = answers.map((question) =>
          Object.keys(question).reduce((prev, curr) => {
            if (!prev) return false;
            return (
              'date' in question[curr] && dateReg.test(question[curr].date)
            );
          }, true)
        );
        expect(dateTest).to.not.contain(false);
      });

      it('Includes an answerer name for all answers', () => {
        const answererTest = answers.map((question) =>
          Object.keys(question).reduce((prev, curr) => {
            if (!prev) return false;
            return (
              'answerer_name' in question[curr] &&
              typeof question[curr].answerer_name === 'string'
            );
          }, true)
        );
        expect(answererTest).to.not.contain(false);
      });

      it('Includes a helpfulness score for all answers', () => {
        const helpfulnessTest = answers.map((question) =>
          Object.keys(question).reduce((prev, curr) => {
            if (!prev) return false;
            return (
              'helpfulness' in question[curr] &&
              typeof question[curr].helpfulness === 'number'
            );
          }, true)
        );
        expect(helpfulnessTest).to.not.contain(false);
      });

      it('Includes photos for all answers', () => {
        const photosTest = answers.map((question) =>
          Object.keys(question).reduce((prev, curr) => {
            if (!prev) return false;
            return (
              'photos' in question[curr] && Array.isArray(question[curr].photos)
            );
          }, true)
        );
        expect(photosTest).to.not.contain(false);
      });
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
