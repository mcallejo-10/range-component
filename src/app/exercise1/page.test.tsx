import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Exercise1 from './page';
import * as rangeService from '@/services/rangeService';

vi.mock('@/services/rangeService', () => ({
  fetchNormalRangeValues: vi.fn(),
}));

describe('Exercise1 Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    vi.mocked(rangeService.fetchNormalRangeValues).mockImplementation(
      () => new Promise(() => {})
    );

    render(<Exercise1 />);

    expect(screen.getByText('Exercise 1: Normal Range')).toBeInTheDocument();
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('should load and display range data successfully', async () => {
    vi.mocked(rangeService.fetchNormalRangeValues).mockResolvedValue({
      min: 1,
      max: 100,
    });

    render(<Exercise1 />);

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Exercise 1: Normal Range')).toBeInTheDocument();

    expect(screen.getByText(/Allowed range:/)).toBeInTheDocument();
    expect(screen.getByText(/Selected values:/)).toBeInTheDocument();
    
    const rangoPermitido = screen.getByText(/Allowed range:/).textContent;
    expect(rangoPermitido).toContain('1.00 €');
    expect(rangoPermitido).toContain('100.00 €');
  });

  it('should display error state when service fails', async () => {
    vi.mocked(rangeService.fetchNormalRangeValues).mockRejectedValue(
      new Error('Network error')
    );

    render(<Exercise1 />);

    await waitFor(() => {
      expect(screen.getByText('Error loading range data')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should call service on mount', async () => {
    vi.mocked(rangeService.fetchNormalRangeValues).mockResolvedValue({
      min: 1,
      max: 100,
    });

    render(<Exercise1 />);

    expect(rangeService.fetchNormalRangeValues).toHaveBeenCalledTimes(1);
  });

  it('should pass correct props to Range component', async () => {
    vi.mocked(rangeService.fetchNormalRangeValues).mockResolvedValue({
      min: 10,
      max: 90,
    });

    render(<Exercise1 />);

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);

    const textInputs = screen.getAllByRole('textbox');
    expect(textInputs).toHaveLength(2);
  });

  it('should format currency correctly', async () => {
    vi.mocked(rangeService.fetchNormalRangeValues).mockResolvedValue({
      min: 5.5,
      max: 50.75,
    });

    render(<Exercise1 />);

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    const rangoText = screen.getByText(/Allowed range:/).textContent;
    expect(rangoText).toContain('5.50 €');
    expect(rangoText).toContain('50.75 €');
  });

  it('should initialize with min and max values from service', async () => {
    vi.mocked(rangeService.fetchNormalRangeValues).mockResolvedValue({
      min: 20,
      max: 80,
    });

    render(<Exercise1 />);

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    const rangoText = screen.getByText(/Allowed range:/);
    const valoresText = screen.getByText(/Selected values:/);
    
    expect(rangoText.textContent).toContain('20.00 €');
    expect(rangoText.textContent).toContain('80.00 €');
    expect(valoresText.textContent).toContain('20.00 €');
    expect(valoresText.textContent).toContain('80.00 €');
  });
});
