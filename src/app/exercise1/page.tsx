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
        <p className={styles.description}>
          Arrastra los handles o edita los valores directamente
        </p>

        <Range
          type="normal"
          minValue={minValue}
          maxValue={maxValue}
          currentMin={currentMin}
          currentMax={currentMax}
          onMinChange={handleMinChange}
          onMaxChange={handleMaxChange}
          editable={true}
        />

        <div className={styles.info}>
          <p>Rango permitido: {minValue} - {maxValue}</p>
          <p>Valores seleccionados: {currentMin.toFixed(2)} - {currentMax.toFixed(2)}</p>
        </div>
      </div>
    </main>
  );
}