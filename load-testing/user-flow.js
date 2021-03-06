import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  scenarios: {
    'constant-rps': {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 1000,
      maxVUs: 2500,
    },
  },
};

const SLEEP_DURATION = 0.1;
const API_BASE_URL = 'http://localhost:8080/qa';

export default function () {
  group('simple user journey', (_) => {
    const idGetQuestions = Math.floor(Math.random() * (1000011 - 1 + 1) + 1);
    const resGetQuestions = http.get(
      `${API_BASE_URL}/questions?product_id=${idGetQuestions}`
    );
    check(resGetQuestions, {
      'is status 200': (r) => r.status === 200,
    });
    sleep(SLEEP_DURATION);

    const idGetAnswers = Math.floor(Math.random() * (3518963 - 1 + 1) + 1);
    const resGetAnswers = http.get(
      `${API_BASE_URL}/questions/${idGetAnswers}/answers`
    );
    check(resGetAnswers, {
      'is status 200': (r) => r.status === 200,
    });
    sleep(SLEEP_DURATION);

    const idQuestionHelpful = Math.floor(Math.random() * (3518963 - 1 + 1) + 1);
    const resQuestionHelpful = http.put(
      `${API_BASE_URL}/questions/${idQuestionHelpful}/helpful`
    );
    check(resQuestionHelpful, {
      'is status 204': (r) => r.status === 204,
    });
    sleep(SLEEP_DURATION);

    const idReportQuestion = Math.floor(Math.random() * (3518963 - 1 + 1) + 1);
    const resReportQuestion = http.put(
      `${API_BASE_URL}/questions/${idReportQuestion}/report`
    );
    check(resReportQuestion, {
      'is status 204': (r) => r.status === 204,
    });
    sleep(SLEEP_DURATION);

    const idAnswerHelpful = Math.floor(Math.random() * (6902277 - 1 + 1) + 1);
    const resAnswerHelpful = http.put(
      `${API_BASE_URL}/answers/${idAnswerHelpful}/helpful`
    );
    check(resAnswerHelpful, {
      'is status 204': (r) => r.status === 204,
    });
    sleep(SLEEP_DURATION);

    const idReportAnswer = Math.floor(Math.random() * (6902277 - 1 + 1) + 1);
    const resReportAnswer = http.put(
      `${API_BASE_URL}/answers/${idReportAnswer}/report`
    );
    check(resReportAnswer, {
      'is status 204': (r) => r.status === 204,
    });
    sleep(SLEEP_DURATION);
  });
}
