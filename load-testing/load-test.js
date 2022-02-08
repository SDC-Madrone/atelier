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