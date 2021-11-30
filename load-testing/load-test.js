import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '1m', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '1m', target: 1000 },
    { duration: '1m', target: 1000 },
    { duration: '2m', target: 0 },
  ],
};

const API_BASE_URL = 'http://localhost:8080/qa';
let productId;

export default function () {
  productId = Math.floor(Math.random() * (1000011 - 1 + 1) + 1);
  http.get(`${API_BASE_URL}/questions?product_id=${productId}`);
}

/*
['GET', `${API_BASE_URL}/questions/3518960/answers`],
    ['PUT', `${API_BASE_URL}/questions/3518960/helpful`],
    ['PUT', `${API_BASE_URL}/questions/3518960/reported`],
    [
      'POST',
      `${API_BASE_URL}/questions`,
      {
        body: 'testing from k6',
        name: 'k6',
        email: 'k@six.com',
        product_id: 315198,
      },
    ],
    ['PUT', `${API_BASE_URL}/answers/6879306/helpful`],
    ['PUT', `${API_BASE_URL}/answers/6879306/reported`],
    [
      'POST',
      `${API_BASE_URL}/questions/3518960/answers`,
      {
        body: 'k6 body',
        name: 'k6 name',
        email: 'k6@test.com',
        photos: ['google.com', 'google.com'],
      },
    ],
  ]);
  */
