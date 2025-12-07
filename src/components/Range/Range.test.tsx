import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Range from './Range';
import userEvent from '@testing-library/user-event';


describe('Range component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
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
      
      expect(handles[0]).toHaveAttribute('aria-valuemin', '0');
      expect(handles[0]).toHaveAttribute('aria-valuemax', '75');
      expect(handles[0]).toHaveAttribute('aria-valuenow', '25');
      
      expect(handles[1]).toHaveAttribute('aria-valuemin', '25');
      expect(handles[1]).toHaveAttribute('aria-valuemax', '100');
      expect(handles[1]).toHaveAttribute('aria-valuenow', '75');
    });
  });

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
      
      expect(minInput.value).toBe('25');
      expect(maxInput.value).toBe('75');
    });
  });

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

      expect(screen.getByText('€25.00')).toBeInTheDocument();
      expect(screen.getByText('€75.00')).toBeInTheDocument();
    });
  });

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

      const handles = screen.getAllByRole('slider');
      expect(handles).toHaveLength(2);
    });
  });

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
      
      await userEvent.clear(minInput);
      await userEvent.type(minInput, '30');
      
      await userEvent.tab();
      
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
      
      await userEvent.clear(maxInput);
      await userEvent.type(maxInput, '80');
      await userEvent.tab();
      
      expect(mockOnMaxChange).toHaveBeenCalledWith(80);
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
      
      await userEvent.clear(minInput);
      await userEvent.type(minInput, '80');
      await userEvent.tab();
      
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
      
      await userEvent.clear(maxInput);
      await userEvent.type(maxInput, '20');
      await userEvent.tab();
      
      expect(mockOnMaxChange).toHaveBeenCalledWith(25);
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
      
      await userEvent.clear(minInput);
      await userEvent.type(minInput, '5');
      await userEvent.tab();
      
      expect(mockOnMinChange).toHaveBeenCalledWith(10);
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
      await userEvent.clear(maxInput);
      await userEvent.type(maxInput, '150');
      await userEvent.tab();
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
      
      await userEvent.clear(minInput);
      await userEvent.type(minInput, 'abc');
      await userEvent.tab();
      
      expect(mockOnMinChange).not.toHaveBeenCalled();
      
      expect(minInput.value).toBe('25');
    });
  });


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

      const minInput = screen.getByLabelText('Minimum value') as HTMLInputElement;
      expect(minInput.value).toBe('25');

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

      expect(minInput.value).toBe('35');
    });
  });
});