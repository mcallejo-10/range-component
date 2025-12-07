'use client';

import { useState, useEffect } from 'react';
import Range from '@/components/Range';
import { fetchNormalRangeValues } from '@/services/rangeService';
import styles from './page.module.css';

export default function Exercise1() {
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [currentMin, setCurrentMin] = useState(0);
  const [currentMax, setCurrentMax] = useState(100);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRangeData = async () => {
      try {
        setLoading(true);
        const data = await fetchNormalRangeValues();
        
        setMinValue(data.min);
        setMaxValue(data.max);
        setCurrentMin(data.min);
        setCurrentMax(data.max);
        
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos del rango');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRangeData();
  }, []);

  const handleMinChange = (value: number) => {
     setCurrentMin(Math.round(value * 100) / 100);
  };

  const handleMaxChange = (value: number) => {
    setCurrentMax(Math.round(value * 100) / 100);
  };
    const formatCurrency = (value: number): string => {
    return `${value.toFixed(2)} €`;
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Exercise 1: Normal Range</h1>
          <p>Cargando datos...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Exercise 1: Normal Range</h1>
          <p className={styles.error}>{error}</p>
          <button onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Exercise 1: Normal Range</h1>

        <div className={styles.rangeArea}>
          <Range
            type="normal"
            minValue={minValue}
            maxValue={maxValue}
            currentMin={currentMin}
            currentMax={currentMax}
            onMinChange={handleMinChange}
            onMaxChange={handleMaxChange}
            formatValue={formatCurrency}
            editable={true}
          />
        </div>

        <div className={styles.info}>
          <p>Rango permitido: {formatCurrency(minValue)} - {formatCurrency(maxValue)}</p>
          <p>Valores seleccionados: {formatCurrency(currentMin)} - {formatCurrency(currentMax)}</p>
        </div>
      </div>
    </main>
  );
}