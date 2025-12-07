import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Range from './Range';
import userEvent from '@testing-library/user-event';

/**
 * Tests for Range component
 * Covers rendering, user interactions, and validation
 */

describe('Range component', () => {
  /**
   * Basic rendering tests
   */
  describe('Rendering', () => {
    it('should render without crashing', () => {
      // Arrange: Minimal required props
      const mockOnMinChange = vi.fn();
      const mockOnMaxChange = vi.fn();

      // Act: Render component
      render(
        <Range
          type="normal"
          minValue={0}
          maxValue={100}
          currentMin={25}
          currentMax={75}
          onMinChange={mockOnMinChange}
          onMaxChange={mockOnMaxChange}
        />
      );

      // Assert: Component rendered (no errors)
      // If this passes, the component mounted successfully
    });

    it('should render two handles', () => {
      const mockOnMinChange = vi.fn();
      const mockOnMaxChange = vi.fn();

      render(
        <Range
          type="normal"
          minValue={0}
          maxValue={100}
          currentMin={25}
          currentMax={75}
          onMinChange={mockOnMinChange}
          onMaxChange={mockOnMaxChange}
        />
      );

      // Assert: Find handles by ARIA role
      const handles = screen.getAllByRole('slider');
      expect(handles).toHaveLength(2);
    });

    it('should render with correct ARIA attributes', () => {
      const mockOnMinChange = vi.fn();
      const mockOnMaxChange = vi.fn();

      render(
        <Range
          type="normal"
          minValue={0}
          maxValue={100}
          currentMin={25}
          currentMax={75}
          onMinChange={mockOnMinChange}
          onMaxChange={mockOnMaxChange}
        />
      );

      const handles = screen.getAllByRole('slider');
      
      // Assert: Check ARIA attributes for accessibility
      expect(handles[0]).toHaveAttribute('aria-valuemin', '0');
      expect(handles[0]).toHaveAttribute('aria-valuemax', '75');
      expect(handles[0]).toHaveAttribute('aria-valuenow', '25');
      
      expect(handles[1]).toHaveAttribute('aria-valuemin', '25');
      expect(handles[1]).toHaveAttribute('aria-valuemax', '100');
      expect(handles[1]).toHaveAttribute('aria-valuenow', '75');
    });
  });

  /**
   * Editable mode tests
   */
  describe('Editable mode', () => {
    it('should render inputs when editable is true', () => {
      const mockOnMinChange = vi.fn();
      const mockOnMaxChange = vi.fn();

      render(
        <Range
          type="normal"
          minValue={0}
          maxValue={100}
          currentMin={25}
          currentMax={75}
          onMinChange={mockOnMinChange}
          onMaxChange={mockOnMaxChange}
          editable={true}
        />
      );

      // Assert: Find inputs by ARIA label
      const minInput = screen.getByLabelText('Minimum value');
      const maxInput = screen.getByLabelText('Maximum value');
      
      expect(minInput).toBeInTheDocument();
      expect(maxInput).toBeInTheDocument();
    });

    it('should render labels when editable is false', () => {
      const mockOnMinChange = vi.fn();
      const mockOnMaxChange = vi.fn();

      render(
        <Range
          type="normal"
          minValue={0}
          maxValue={100}
          currentMin={25}
          currentMax={75}
          onMinChange={mockOnMinChange}
          onMaxChange={mockOnMaxChange}
          editable={false}
        />
      );

      // Assert: Labels should be present (no inputs)
      const inputs = screen.queryAllByRole('textbox');
      expect(inputs).toHaveLength(0);
    });

    it('should display current values in inputs', () => {
      const mockOnMinChange = vi.fn();
      const mockOnMaxChange = vi.fn();

      render(
        <Range
          type="normal"
          minValue={0}
          maxValue={100}
          currentMin={25}
          currentMax={75}
          onMinChange={mockOnMinChange}
          onMaxChange={mockOnMaxChange}
          editable={true}
        />
      );

      const minInput = screen.getByLabelText('Minimum value') as HTMLInputElement;
      const maxInput = screen.getByLabelText('Maximum value') as HTMLInputElement;
      
      // Assert: Check input values
      expect(minInput.value).toBe('25');
      expect(maxInput.value).toBe('75');
    });
  });

  /**
   * Format value tests
   */
  describe('Format value', () => {
    it('should apply custom formatValue function', () => {
      const mockOnMinChange = vi.fn();
      const mockOnMaxChange = vi.fn();
      const formatCurrency = (value: number) => `€${value.toFixed(2)}`;

      render(
        <Range
          type="normal"
          minValue={0}
          maxValue={100}
          currentMin={25}
          currentMax={75}
          onMinChange={mockOnMinChange}
          onMaxChange={mockOnMaxChange}
          editable={false}
          formatValue={formatCurrency}
        />
      );

      // Assert: Labels should show formatted values
      expect(screen.getByText('€25.00')).toBeInTheDocument();
      expect(screen.getByText('€75.00')).toBeInTheDocument();
    });
  });

  /**
   * Fixed values mode tests
   */
  describe('Fixed values mode', () => {
    it('should work with fixed values array', () => {
      const mockOnMinChange = vi.fn();
      const mockOnMaxChange = vi.fn();
      const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

      render(
        <Range
          type="fixed"
          minValue={1.99}
          maxValue={70.99}
          currentMin={5.99}
          currentMax={50.99}
          onMinChange={mockOnMinChange}
          onMaxChange={mockOnMaxChange}
          fixedValues={fixedValues}
          editable={false}
        />
      );

      // Assert: Component renders without errors
      const handles = screen.getAllByRole('slider');
      expect(handles).toHaveLength(2);
    });
  });

    /**
   * User interaction tests
   */
  describe('User interactions', () => {
    it('should call onMinChange when min input is edited and blurred', async () => {
      const mockOnMinChange = vi.fn();
      const mockOnMaxChange = vi.fn();

      render(
        <Range
          type="normal"
          minValue={0}
          maxValue={100}
          currentMin={25}
          currentMax={75}
          onMinChange={mockOnMinChange}
          onMaxChange={mockOnMaxChange}
          editable={true}
        />
      );

      const minInput = screen.getByLabelText('Minimum value');
      
      // Act: Clear input and type new value
      await userEvent.clear(minInput);
      await userEvent.type(minInput, '30');
      
      // Act: Blur (lose focus) to trigger validation
      await userEvent.tab();
      
      // Assert: onMinChange should have been called with the new value
      expect(mockOnMinChange).toHaveBeenCalledWith(30);
    });

    it('should call onMaxChange when max input is edited and blurred', async () => {
      const mockOnMinChange = vi.fn();
      const mockOnMaxChange = vi.fn();

      render(
        <Range
          type="normal"
          minValue={0}
          maxValue={100}
          currentMin={25}
          currentMax={75}
          onMinChange={mockOnMinChange}
          onMaxChange={mockOnMaxChange}
          editable={true}
        />
      );

      const maxInput = screen.getByLabelText('Maximum value');
      
      // Act: Edit and blur
      await userEvent.clear(maxInput);
      await userEvent.type(maxInput, '80');
      await userEvent.tab();
      
      // Assert: onMaxChange should have been called
      expect(mockOnMaxChange).toHaveBeenCalledWith(80);
    });

    it('should not allow min value greater than current max', async () => {
      const mockOnMinChange = vi.fn();
      const mockOnMaxChange = vi.fn();

      render(
        <Range
          type="normal"
          minValue={0}
          maxValue={100}
          currentMin={25}
          currentMax={75}
          onMinChange={mockOnMinChange}
          onMaxChange={mockOnMaxChange}
          editable={true}
        />
      );

      const minInput = screen.getByLabelText('Minimum value');
      
      // Act: Try to set min to 80 (greater than max 75)
      await userEvent.clear(minInput);
      await userEvent.type(minInput, '80');
      await userEvent.tab();
      
      // Assert: Should be clamped to currentMax (75)
      expect(mockOnMinChange).toHaveBeenCalledWith(75);
    });

    it('should not allow max value less than current min', async () => {
      const mockOnMinChange = vi.fn();
      const mockOnMaxChange = vi.fn();

      render(
        <Range
          type="normal"
          minValue={0}
          maxValue={100}
          currentMin={25}
          currentMax={75}
          onMinChange={mockOnMinChange}
          onMaxChange={mockOnMaxChange}
          editable={true}
        />
      );

      const maxInput = screen.getByLabelText('Maximum value');
      
      // Act: Try to set max to 20 (less than min 25)
      await userEvent.clear(maxInput);
      await userEvent.type(maxInput, '20');
      await userEvent.tab();
      
      // Assert: Should be clamped to currentMin (25)
      expect(mockOnMaxChange).toHaveBeenCalledWith(25);
    });

    it('should not allow min value less than minValue prop', async () => {
      const mockOnMinChange = vi.fn();
      const mockOnMaxChange = vi.fn();

      render(
        <Range
          type="normal"
          minValue={10}
          maxValue={100}
          currentMin={25}
          currentMax={75}
          onMinChange={mockOnMinChange}
          onMaxChange={mockOnMaxChange}
          editable={true}
        />
      );

      const minInput = screen.getByLabelText('Minimum value');
      
      // Act: Try to set min to 5 (less than minValue 10)
      await userEvent.clear(minInput);
      await userEvent.type(minInput, '5');
      await userEvent.tab();
      
      // Assert: Should be clamped to minValue (10)
      expect(mockOnMinChange).toHaveBeenCalledWith(10);
    });

    it('should not allow max value greater than maxValue prop', async () => {
      const mockOnMinChange = vi.fn();
      const mockOnMaxChange = vi.fn();

      render(
        <Range
          type="normal"
          minValue={0}
          maxValue={100}
          currentMin={25}
          currentMax={75}
          onMinChange={mockOnMinChange}
          onMaxChange={mockOnMaxChange}
          editable={true}
        />
      );

      const maxInput = screen.getByLabelText('Maximum value');
      
      // Act: Try to set max to 150 (greater than maxValue 100)
      await userEvent.clear(maxInput);
      await userEvent.type(maxInput, '150');
      await userEvent.tab();
      
      // Assert: Should be clamped to maxValue (100)
      expect(mockOnMaxChange).toHaveBeenCalledWith(100);
    });

    it('should restore original value if input is invalid (NaN)', async () => {
      const mockOnMinChange = vi.fn();
      const mockOnMaxChange = vi.fn();

      render(
        <Range
          type="normal"
          minValue={0}
          maxValue={100}
          currentMin={25}
          currentMax={75}
          onMinChange={mockOnMinChange}
          onMaxChange={mockOnMaxChange}
          editable={true}
        />
      );

      const minInput = screen.getByLabelText('Minimum value') as HTMLInputElement;
      
      // Act: Type invalid text
      await userEvent.clear(minInput);
      await userEvent.type(minInput, 'abc');
      await userEvent.tab();
      
      // Assert: onMinChange should NOT have been called (invalid input)
      expect(mockOnMinChange).not.toHaveBeenCalled();
      
      // Assert: Input should be restored to original value
      expect(minInput.value).toBe('25');
    });
  });

  /**
   * Props update tests
   */
  describe('Props updates', () => {
    it('should update input values when currentMin/currentMax props change', () => {
      const mockOnMinChange = vi.fn();
      const mockOnMaxChange = vi.fn();

      const { rerender } = render(
        <Range
          type="normal"
          minValue={0}
          maxValue={100}
          currentMin={25}
          currentMax={75}
          onMinChange={mockOnMinChange}
          onMaxChange={mockOnMaxChange}
          editable={true}
        />
      );

      // Assert: Initial values
      const minInput = screen.getByLabelText('Minimum value') as HTMLInputElement;
      expect(minInput.value).toBe('25');

      // Act: Update props
      rerender(
        <Range
          type="normal"
          minValue={0}
          maxValue={100}
          currentMin={35}
          currentMax={75}
          onMinChange={mockOnMinChange}
          onMaxChange={mockOnMaxChange}
          editable={true}
        />
      );

      // Assert: Input should reflect new value
      expect(minInput.value).toBe('35');
    });
  });
});