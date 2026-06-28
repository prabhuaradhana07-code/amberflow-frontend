import http from 'k6/http';
import { check, sleep } from 'k6';

// Test Configuration
export const options = {
  // Max Virtual Users allowed on Grafana Free Tier is 100
  vus: 100,
  // Duration of the test
  duration: '30s',
};

export default function () {
  // 1. User opens the site (Frontend Homepage)
  const resFrontend = http.get('https://amberflow.in');
  check(resFrontend, {
    'homepage loaded': (r) => r.status === 200,
  });

  // 2. The site automatically fetches the products to display on the screen
  const resBackend = http.get('https://amberflow-backend-production.up.railway.app/api/products');
  check(resBackend, {
    'products loaded': (r) => r.status === 200,
  });

  // 3. User spends 10 seconds scrolling and reading the page
  sleep(10);
}
