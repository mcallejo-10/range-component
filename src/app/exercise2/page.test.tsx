import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Exercise2 from './page';
import * as rangeService from '@/services/rangeService';

// Mock del servicio
vi.mock('@/services/rangeService', () => ({
  fetchFixedRangeValues: vi.fn(),
}));

describe('Exercise2 Page', () => {
  const mockFixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    // Mock con promesa que nunca se resuelve para capturar loading
    vi.mocked(rangeService.fetchFixedRangeValues).mockImplementation(
      () => new Promise(() => {})
    );

    render(<Exercise2 />);

    expect(screen.getByText('Exercise 2: Fixed Values Range')).toBeInTheDocument();
    expect(screen.getByText('Cargando datos...')).toBeInTheDocument();
  });

  it('should load and display fixed range values successfully', async () => {
    vi.mocked(rangeService.fetchFixedRangeValues).mockResolvedValue({
      rangeValues: mockFixedValues,
    });

    render(<Exercise2 />);

    // Esperar a que desaparezca el loading
    await waitFor(() => {
      expect(screen.queryByText('Cargando datos...')).not.toBeInTheDocument();
    });

    // Verificar que se renderiza el título
    expect(screen.getByText('Exercise 2: Fixed Values Range')).toBeInTheDocument();

    // Verificar que se muestra la lista de valores disponibles
    expect(screen.getByText('Valores disponibles:')).toBeInTheDocument();
  });

  it('should display error state when service fails', async () => {
    vi.mocked(rangeService.fetchFixedRangeValues).mockRejectedValue(
      new Error('Network error')
    );

    render(<Exercise2 />);

    // Esperar a que aparezca el error
    await waitFor(() => {
      expect(screen.getByText('Error al cargar los datos del rango')).toBeInTheDocument();
    });

    // Verificar botón de reintentar
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
  });

  it('should call service on mount', async () => {
    vi.mocked(rangeService.fetchFixedRangeValues).mockResolvedValue({
      rangeValues: mockFixedValues,
    });

    render(<Exercise2 />);

    // Verificar que se llamó al servicio
    expect(rangeService.fetchFixedRangeValues).toHaveBeenCalledTimes(1);
  });

  it('should pass correct props to Range component', async () => {
    vi.mocked(rangeService.fetchFixedRangeValues).mockResolvedValue({
      rangeValues: mockFixedValues,
    });

    render(<Exercise2 />);

    await waitFor(() => {
      expect(screen.queryByText('Cargando datos...')).not.toBeInTheDocument();
    });

    // Verificar que existen los sliders (Range renderiza 2 inputs de tipo range)
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);

    // En Exercise 2, editable={false}, por lo que NO debe haber inputs editables
    const textInputs = screen.queryAllByRole('textbox');
    expect(textInputs).toHaveLength(0);
  });

  it('should display all fixed values with correct currency format', async () => {
    vi.mocked(rangeService.fetchFixedRangeValues).mockResolvedValue({
      rangeValues: mockFixedValues,
    });

    render(<Exercise2 />);

    await waitFor(() => {
      expect(screen.queryByText('Cargando datos...')).not.toBeInTheDocument();
    });

    // Verificar que todos los valores están presentes con formato correcto
    mockFixedValues.forEach((value) => {
      const formattedValue = `${value.toFixed(2)} €`;
      // Usar getAllByText porque el valor puede aparecer más de una vez
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
      expect(screen.queryByText('Cargando datos...')).not.toBeInTheDocument();
    });

    // Los valores iniciales deben ser el primero y el último del array
    const firstValue = mockFixedValues[0];
    const lastValue = mockFixedValues[mockFixedValues.length - 1];

    // Estos valores deberían estar presentes (aparecen múltiples veces: Range + lista)
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
      expect(screen.queryByText('Cargando datos...')).not.toBeInTheDocument();
    });

    // Contar cuántos valores hay en la lista
    // Cada valor aparece en la lista de "Valores disponibles"
    const valuesContainer = screen.getByText('Valores disponibles:').parentElement;
    const valueElements = valuesContainer?.querySelectorAll('span');
    
    expect(valueElements?.length).toBe(6);
  });

  it('should handle empty rangeValues array gracefully', async () => {
    vi.mocked(rangeService.fetchFixedRangeValues).mockResolvedValue({
      rangeValues: [],
    });

    render(<Exercise2 />);

    await waitFor(() => {
      expect(screen.queryByText('Cargando datos...')).not.toBeInTheDocument();
    });

    // La página debería renderizarse mostrando el mensaje de error del componente
    expect(screen.getByText('Exercise 2: Fixed Values Range')).toBeInTheDocument();
    expect(screen.getByText(/Error: valores de rango no válidos/i)).toBeInTheDocument();
  });

  it('should handle single value gracefully', async () => {
    vi.mocked(rangeService.fetchFixedRangeValues).mockResolvedValue({
      rangeValues: [5.99],
    });

    render(<Exercise2 />);

    await waitFor(() => {
      expect(screen.queryByText('Cargando datos...')).not.toBeInTheDocument();
    });

    // La página debería renderizarse sin errores con un solo valor
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
      expect(screen.queryByText('Cargando datos...')).not.toBeInTheDocument();
    });

    // Verificar formato con exactamente 2 decimales (aparecen múltiples veces)
    expect(screen.getAllByText('1.50 €').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2.79 €').length).toBeGreaterThan(0);
    expect(screen.getAllByText('3.10 €').length).toBeGreaterThan(0);
  });
});
