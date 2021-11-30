import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  scenarios: {
    rps_1000: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: '30s',
      preAllocatedVUs: 100, // how large the initial pool of VUs would be
      maxVUs: 200, // if the preAllocatedVUs are not enough, we can initialize more
    },
  },
};

const API_BASE_URL = 'http://localhost:8080/qa';
let productId;

export default function () {
  productId = Math.floor(Math.random() * (1000011 - 1 + 1) + 1);
  http.get(`${API_BASE_URL}/questions?product_id=${productId}`);
}
