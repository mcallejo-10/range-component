import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Exercise1 from './page';
import * as rangeService from '@/services/rangeService';

// Mock del servicio
vi.mock('@/services/rangeService', () => ({
  fetchNormalRangeValues: vi.fn(),
}));

describe('Exercise1 Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    // Mock con promesa que nunca se resuelve para capturar loading
    vi.mocked(rangeService.fetchNormalRangeValues).mockImplementation(
      () => new Promise(() => {})
    );

    render(<Exercise1 />);

    expect(screen.getByText('Exercise 1: Normal Range')).toBeInTheDocument();
    expect(screen.getByText('Cargando datos...')).toBeInTheDocument();
  });

  it('should load and display range data successfully', async () => {
    // Mock con datos correctos
    vi.mocked(rangeService.fetchNormalRangeValues).mockResolvedValue({
      min: 1,
      max: 100,
    });

    render(<Exercise1 />);

    // Esperar a que desaparezca el loading
    await waitFor(() => {
      expect(screen.queryByText('Cargando datos...')).not.toBeInTheDocument();
    });

    // Verificar que se renderiza el título
    expect(screen.getByText('Exercise 1: Normal Range')).toBeInTheDocument();

    // Verificar que se muestra la información del rango
    expect(screen.getByText(/Rango permitido:/)).toBeInTheDocument();
    expect(screen.getByText(/Valores seleccionados:/)).toBeInTheDocument();
    
    // Los valores 1.00 € y 100.00 € aparecen múltiples veces en la página
    const rangoPermitido = screen.getByText(/Rango permitido:/).textContent;
    expect(rangoPermitido).toContain('1.00 €');
    expect(rangoPermitido).toContain('100.00 €');
  });

  it('should display error state when service fails', async () => {
    // Mock con error
    vi.mocked(rangeService.fetchNormalRangeValues).mockRejectedValue(
      new Error('Network error')
    );

    render(<Exercise1 />);

    // Esperar a que aparezca el error
    await waitFor(() => {
      expect(screen.getByText('Error al cargar los datos del rango')).toBeInTheDocument();
    });

    // Verificar botón de reintentar
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
  });

  it('should call service on mount', async () => {
    vi.mocked(rangeService.fetchNormalRangeValues).mockResolvedValue({
      min: 1,
      max: 100,
    });

    render(<Exercise1 />);

    // Verificar que se llamó al servicio
    expect(rangeService.fetchNormalRangeValues).toHaveBeenCalledTimes(1);
  });

  it('should pass correct props to Range component', async () => {
    vi.mocked(rangeService.fetchNormalRangeValues).mockResolvedValue({
      min: 10,
      max: 90,
    });

    render(<Exercise1 />);

    await waitFor(() => {
      expect(screen.queryByText('Cargando datos...')).not.toBeInTheDocument();
    });

    // Verificar que existen los sliders (Range renderiza 2 inputs de tipo range)
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);

    // Verificar que los inputs editables están presentes (type="text" con formateo)
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
      expect(screen.queryByText('Cargando datos...')).not.toBeInTheDocument();
    });

    // Verificar formato con 2 decimales y símbolo € (aparece múltiples veces)
    const rangoText = screen.getByText(/Rango permitido:/).textContent;
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
      expect(screen.queryByText('Cargando datos...')).not.toBeInTheDocument();
    });

    // Los valores seleccionados inicialmente deben ser iguales al rango
    const rangoText = screen.getByText(/Rango permitido:/);
    const valoresText = screen.getByText(/Valores seleccionados:/);
    
    expect(rangoText.textContent).toContain('20.00 €');
    expect(rangoText.textContent).toContain('80.00 €');
    expect(valoresText.textContent).toContain('20.00 €');
    expect(valoresText.textContent).toContain('80.00 €');
  });
});
