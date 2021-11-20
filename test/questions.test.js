const supertest = require('supertest');
const app = require('../app');

describe('GET /questions', () => {
  let server;
  let request;

  before(() => {
    server = app.listen();
    request = supertest.agent(server);
  });

  after(() => {
    server.close(() => console.log('app is closed'));
  });

  it('returns a status code of 200', async () => {
    request.get('/questions').expect(200);
  });

  it('responds with json', async () => {
    request.get('/questions').expect('Content-Type', /json/);
  });
});
