import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  scenarios: {
    rps_1000: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 100, 
      maxVUs: 200,
    },
  },
};

const API_BASE_URL = 'http://localhost:8080/qa';
let productId;

export default function () {
  productId = Math.floor(Math.random() * (1000011 - 1 + 1) + 1);
  http.get(`${API_BASE_URL}/questions?product_id=${productId}`);
}
