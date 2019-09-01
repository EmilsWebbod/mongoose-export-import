'use strict';

const expect = require('chai').expect;
import { isNullOrEmpty } from '../src';

describe('simple validate test', () => {
  it('should return true for null string', () => {
    const result = isNullOrEmpty(null);
    expect(result).to.equal(true);
  });
  
  it('should return true for undefined string', () => {
    const result = isNullOrEmpty(undefined);
    expect(result).to.equal(true);
  });
  
  it('should return true for empty string', () => {
    const result = isNullOrEmpty("");
    expect(result).to.equal(true);
  });
  
  it('should return true for whitespace string', () => {
    const result = isNullOrEmpty(" ");
    expect(result).to.equal(true);
  });
  
  it('should return false for non-empty string', () => {
    const result = isNullOrEmpty("test");
    expect(result).to.equal(false);
  });
});