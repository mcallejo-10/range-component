'use client';

import { useState, useEffect } from 'react';
import Range from '@/components/Range';
import { fetchFixedRangeValues } from '@/services/rangeService';
import styles from './page.module.css';

export default function Exercise2() {
  const [rangeValues, setRangeValues] = useState<number[]>([]);
  
  const [currentMin, setCurrentMin] = useState(0);
  const [currentMax, setCurrentMax] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRangeData = async () => {
      try {
        setLoading(true);
        const data = await fetchFixedRangeValues();
        
        setRangeValues(data.rangeValues);
        setCurrentMin(data.rangeValues[0]);
        setCurrentMax(data.rangeValues[data.rangeValues.length - 1]);
        
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
    setCurrentMin(value);
  };

  const handleMaxChange = (value: number) => {
    setCurrentMax(value);
  };

  // Función para formatear valores como moneda
  const formatCurrency = (value: number): string => {
    return `€${value.toFixed(2)}`;
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Exercise 2: Fixed Values Range</h1>
          <p>Cargando datos...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Exercise 2: Fixed Values Range</h1>
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
        <h1 className={styles.title}>Exercise 2: Fixed Values Range</h1>
        <p className={styles.description}>
          Arrastra los handles para seleccionar precios fijos
        </p>

        <Range
          type="fixed"
          minValue={rangeValues[0]}
          maxValue={rangeValues[rangeValues.length - 1]}
          currentMin={currentMin}
          currentMax={currentMax}
          onMinChange={handleMinChange}
          onMaxChange={handleMaxChange}
          fixedValues={rangeValues}
          formatValue={formatCurrency}
          editable={false}
        />

        <div className={styles.info}>
          <p>Valores disponibles:</p>
          <div className={styles.values}>
            {rangeValues.map((value, index) => (
              <span 
                key={index}
                className={
                  value >= currentMin && value <= currentMax 
                    ? styles.valueActive 
                    : styles.value
                }
              >
                {formatCurrency(value)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}