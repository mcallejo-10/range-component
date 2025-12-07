import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Exercise2 from './page';
import * as rangeService from '@/services/rangeService';

vi.mock('@/services/rangeService', () => ({
  fetchFixedRangeValues: vi.fn(),
}));

describe('Exercise2 Page', () => {
  const mockFixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    vi.mocked(rangeService.fetchFixedRangeValues).mockImplementation(
      () => new Promise(() => {})
    );

    render(<Exercise2 />);

    expect(screen.getByText('Exercise 2: Fixed Values Range')).toBeInTheDocument();
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('should load and display fixed range values successfully', async () => {
    vi.mocked(rangeService.fetchFixedRangeValues).mockResolvedValue({
      rangeValues: mockFixedValues,
    });

    render(<Exercise2 />);

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Exercise 2: Fixed Values Range')).toBeInTheDocument();

    expect(screen.getByText('Available values:')).toBeInTheDocument();
  });

  it('should display error state when service fails', async () => {
    vi.mocked(rangeService.fetchFixedRangeValues).mockRejectedValue(
      new Error('Network error')
    );

    render(<Exercise2 />);

    await waitFor(() => {
      expect(screen.getByText('Error loading range data')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should call service on mount', async () => {
    vi.mocked(rangeService.fetchFixedRangeValues).mockResolvedValue({
      rangeValues: mockFixedValues,
    });

    render(<Exercise2 />);

    expect(rangeService.fetchFixedRangeValues).toHaveBeenCalledTimes(1);
  });

  it('should pass correct props to Range component', async () => {
    vi.mocked(rangeService.fetchFixedRangeValues).mockResolvedValue({
      rangeValues: mockFixedValues,
    });

    render(<Exercise2 />);

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);

    const textInputs = screen.queryAllByRole('textbox');
    expect(textInputs).toHaveLength(0);
  });

  it('should display all fixed values with correct currency format', async () => {
    vi.mocked(rangeService.fetchFixedRangeValues).mockResolvedValue({
      rangeValues: mockFixedValues,
    });

    render(<Exercise2 />);

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    mockFixedValues.forEach((value) => {
      const formattedValue = `${value.toFixed(2)} €`;
      const elements = screen.getAllByText(formattedValue);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('should initialize with first and last values as min and max', async () => {
    vi.mocked(rangeService.fetchFixedRangeValues).mockResolvedValue({
      rangeValues: mockFixedValues,
    });

    render(<Exercise2 />);

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    const firstValue = mockFixedValues[0];
    const lastValue = mockFixedValues[mockFixedValues.length - 1];

    const allFirstValues = screen.getAllByText(`${firstValue.toFixed(2)} €`);
    const allLastValues = screen.getAllByText(`${lastValue.toFixed(2)} €`);
    
    expect(allFirstValues.length).toBeGreaterThan(0);
    expect(allLastValues.length).toBeGreaterThan(0);
  });

  it('should display exactly 6 fixed values', async () => {
    vi.mocked(rangeService.fetchFixedRangeValues).mockResolvedValue({
      rangeValues: mockFixedValues,
    });

    render(<Exercise2 />);

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

     const valuesContainer = screen.getByText('Available values:').parentElement;
    const valueElements = valuesContainer?.querySelectorAll('span');
    
    expect(valueElements?.length).toBe(6);
  });

  it('should handle empty rangeValues array gracefully', async () => {
    vi.mocked(rangeService.fetchFixedRangeValues).mockResolvedValue({
      rangeValues: [],
    });

    render(<Exercise2 />);

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Exercise 2: Fixed Values Range')).toBeInTheDocument();
  });

  it('should handle single value gracefully', async () => {
    vi.mocked(rangeService.fetchFixedRangeValues).mockResolvedValue({
      rangeValues: [5.99],
    });

    render(<Exercise2 />);

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Exercise 2: Fixed Values Range')).toBeInTheDocument();
    expect(screen.getAllByText('5.99 €').length).toBeGreaterThan(0);
  });

  it('should format decimal values correctly', async () => {
    const customValues = [1.5, 2.789, 3.1];
    vi.mocked(rangeService.fetchFixedRangeValues).mockResolvedValue({
      rangeValues: customValues,
    });

    render(<Exercise2 />);

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    expect(screen.getAllByText('1.50 €').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2.79 €').length).toBeGreaterThan(0);
    expect(screen.getAllByText('3.10 €').length).toBeGreaterThan(0);
  });
});
