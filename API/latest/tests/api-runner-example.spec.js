// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Public API Example', () => {
  test('GET request to jsonplaceholder returns 200', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('id', 1);
  });
}); 