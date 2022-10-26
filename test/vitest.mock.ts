import {MongooseMock} from '@ludens-reklame/vitest-mockify/dist/MongooseMock';
import { initTestDatabase } from './mock/models.mock';

export const databaseMock = new MongooseMock(initTestDatabase);
