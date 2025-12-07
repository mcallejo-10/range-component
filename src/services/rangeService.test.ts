import { describe, it, expect } from 'vitest';
import { fetchNormalRangeValues, fetchFixedRangeValues } from './rangeService';

describe('rangeService', () => {

  describe('fetchNormalRangeValues', () => {
    it('should return an object with min and max properties', async () => {
      const result = await fetchNormalRangeValues();
      
      expect(result).toHaveProperty('min');
      expect(result).toHaveProperty('max');
    });

    it('should return min=1 and max=100', async () => {
      const result = await fetchNormalRangeValues();
      
      expect(result.min).toBe(1);
      expect(result.max).toBe(100);
    });

    it('should be an async function (returns Promise)', async () => {
      const result = fetchNormalRangeValues();
      
      expect(result).toBeInstanceOf(Promise);

      await result;
    });

    it('should take at least 200ms (simulates network delay)', async () => {
      const startTime = Date.now();
      
      await fetchNormalRangeValues();
      
      const endTime = Date.now();
      const elapsed = endTime - startTime;
      
      expect(elapsed).toBeGreaterThanOrEqual(200);
    });
  });


  describe('fetchFixedRangeValues', () => {
    it('should return an object with rangeValues property', async () => {
      const result = await fetchFixedRangeValues();
      
      expect(result).toHaveProperty('rangeValues');
    });

    it('should return an array of 6 values', async () => {
      const result = await fetchFixedRangeValues();
      
      expect(Array.isArray(result.rangeValues)).toBe(true);
      expect(result.rangeValues).toHaveLength(6);
    });

    it('should return the correct values from requirements', async () => {
      const expectedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
      
      const result = await fetchFixedRangeValues();
      
      expect(result.rangeValues).toEqual(expectedValues);
    });

    it('should return values sorted from lowest to highest', async () => {
      const result = await fetchFixedRangeValues();
      
      const sorted = [...result.rangeValues].sort((a, b) => a - b);
      
      expect(result.rangeValues).toEqual(sorted);
    });

    it('should only contain positive numbers', async () => {
      const result = await fetchFixedRangeValues();
      
      result.rangeValues.forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      });
    });
  });
});