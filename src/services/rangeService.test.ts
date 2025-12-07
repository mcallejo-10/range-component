import { describe, it, expect } from 'vitest';
import { fetchNormalRangeValues, fetchFixedRangeValues } from './rangeService';

/**
 * Tests for rangeService
 * Verify that mock services return correct data
 */

describe('rangeService', () => {
  /**
   * Tests for fetchNormalRangeValues
   */
  describe('fetchNormalRangeValues', () => {
    it('should return an object with min and max properties', async () => {
      // Act: Execute the function
      const result = await fetchNormalRangeValues();
      
      // Assert: Verify structure
      expect(result).toHaveProperty('min');
      expect(result).toHaveProperty('max');
    });

    it('should return min=1 and max=100', async () => {
      // Act
      const result = await fetchNormalRangeValues();
      
      // Assert: Verify specific values
      expect(result.min).toBe(1);
      expect(result.max).toBe(100);
    });

    it('should be an async function (returns Promise)', async () => {
      // Act
      const result = fetchNormalRangeValues();
      
      // Assert: Verify it's a Promise
      expect(result).toBeInstanceOf(Promise);
      
      // Resolve promise to avoid warnings
      await result;
    });

    it('should take at least 200ms (simulates network delay)', async () => {
      // Arrange: Save start time
      const startTime = Date.now();
      
      // Act: Execute function
      await fetchNormalRangeValues();
      
      // Arrange: Calculate elapsed time
      const endTime = Date.now();
      const elapsed = endTime - startTime;
      
      // Assert: Verify it took at least 200ms
      expect(elapsed).toBeGreaterThanOrEqual(200);
    });
  });

  /**
   * Tests for fetchFixedRangeValues
   */
  describe('fetchFixedRangeValues', () => {
    it('should return an object with rangeValues property', async () => {
      // Act
      const result = await fetchFixedRangeValues();
      
      // Assert
      expect(result).toHaveProperty('rangeValues');
    });

    it('should return an array of 6 values', async () => {
      // Act
      const result = await fetchFixedRangeValues();
      
      // Assert: Verify it's an array
      expect(Array.isArray(result.rangeValues)).toBe(true);
      // Assert: Verify length
      expect(result.rangeValues).toHaveLength(6);
    });

    it('should return the correct values from requirements', async () => {
      // Arrange: Expected values from requirements
      const expectedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
      
      // Act
      const result = await fetchFixedRangeValues();
      
      // Assert: Verify each value
      expect(result.rangeValues).toEqual(expectedValues);
    });

    it('should return values sorted from lowest to highest', async () => {
      // Act
      const result = await fetchFixedRangeValues();
      
      // Arrange: Create sorted copy
      const sorted = [...result.rangeValues].sort((a, b) => a - b);
      
      // Assert: Verify they were already sorted
      expect(result.rangeValues).toEqual(sorted);
    });

    it('should only contain positive numbers', async () => {
      // Act
      const result = await fetchFixedRangeValues();
      
      // Assert: Verify each value
      result.rangeValues.forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      });
    });
  });
});