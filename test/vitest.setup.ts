import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { databaseMock } from './vitest.mock';

process.env.NODE_ENV = 'test';

beforeAll(async () => {
  await databaseMock.beforeAll();
});
beforeEach(async () => {
  await databaseMock.beforeEach();
});
afterEach(async () => {
  await databaseMock.afterEach();
});
afterAll(async () => {
  await databaseMock.afterAll();
});
