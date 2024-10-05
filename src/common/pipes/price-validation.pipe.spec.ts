import { PriceValidationPipe } from './price-validation.pipe';
import { BadRequestException } from '@nestjs/common';

describe('PriceValidationPipe', () => {
  let pipe: PriceValidationPipe;

  beforeEach(() => {
    pipe = new PriceValidationPipe();
  });

  it('should pass validation for valid price within range', () => {
    expect(pipe.transform('5000', { type: 'query' })).toBe(5000);
  });

  it('should throw error if price is less than 1000', () => {
    expect(() => pipe.transform('999', { type: 'query' })).toThrow(
      new BadRequestException('Price must be between 1000 and 10000000'),
    );
  });

  it('should throw error if price is more than 10,000,000', () => {
    expect(() => pipe.transform('10000001', { type: 'query' })).toThrow(
      new BadRequestException('Price must be between 1000 and 10000000'),
    );
  });

  it('should throw error if price is not a number', () => {
    expect(() => pipe.transform('invalid', { type: 'query' })).toThrow(
      new BadRequestException('Price must be a number'),
    );
  });
});
