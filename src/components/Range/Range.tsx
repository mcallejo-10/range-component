'use client';
import React, { useState, useRef, useEffect } from 'react';
import { RangeProps } from '@/types/range.types';
import styles from './Range.module.css';

export default function Range({
    type,
    minValue,
    maxValue,
    currentMin,
    currentMax,
    onMinChange,
    onMaxChange,
    fixedValues = [],
    formatValue = (value: number) => value.toString(),
    editable = true,
}: RangeProps ) {
    // Validaciones defensivas para evitar crashes
    if (minValue === undefined || maxValue === undefined || 
        currentMin === undefined || currentMax === undefined) {
        return <div className={styles.container}>Error: valores de rango no válidos</div>;
    }

    if (type === 'fixed' && fixedValues.length === 0) {
        return <div className={styles.container}>Error: no hay valores fijos disponibles</div>;
    }

    const rangeRef = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
    const [minInput, setMinInput] = useState(currentMin.toString());
    const [maxInput, setMaxInput] = useState(currentMax.toString());
    
    useEffect(() => {
        setMinInput(currentMin.toString());
        setMaxInput(currentMax.toString());
    }, [currentMin, currentMax]);

    const getPercentage = (value: number) => {
        if (type === 'fixed' && fixedValues.length > 0) {
            const index = fixedValues.indexOf(value);
            return (index / (fixedValues.length - 1)) * 100;
        }
        return ((value - minValue) / (maxValue - minValue)) * 100;
    };

    const minPercentage = getPercentage(currentMin);
    const maxPercentage = getPercentage(currentMax);

    const getValueFromMousePosition = (clientX: number) => {
        if (!rangeRef.current) return currentMin;

        const rect = rangeRef.current.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        
        if (type === 'fixed' && fixedValues.length > 0) {
            const index = Math.round(percentage * (fixedValues.length - 1));
            return fixedValues[index];
        }
        return minValue + percentage * (maxValue - minValue);
    };
    
    const handleMouseDown = (handle: 'min' | 'max') => (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(handle);
    };

    const handleTouchStart = (handle: 'min' | 'max') => (e: React.TouchEvent) => {
        e.preventDefault();
        setIsDragging(handle);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        
        const value = getValueFromMousePosition(e.clientX);
        
        if (isDragging === 'min') {
            const newMin = Math.min(value, currentMax);
            onMinChange(newMin);
        } else {
            const newMax = Math.max(value, currentMin);
            onMaxChange(newMax);
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging) return;
        
        const touch = e.touches[0];
        const value = getValueFromMousePosition(touch.clientX);
        
        if (isDragging === 'min') {
            const newMin = Math.min(value, currentMax);
            onMinChange(newMin);
        } else {
            const newMax = Math.max(value, currentMin);
            onMaxChange(newMax);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(null);
    };

    const handleTouchEnd = () => {
        setIsDragging(null);
    };

    useEffect(() => {
        if (!isDragging) return;

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
    
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, currentMin, currentMax, fixedValues, minValue, maxValue, type, onMinChange, onMaxChange]);

    const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMinInput(e.target.value);
    };

    const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaxInput(e.target.value);
    };

    const handleMinInputBlur = () => {
        const value = parseFloat(minInput);
        if (!isNaN(value)) {
            const validValue = Math.max(minValue, Math.min(value, currentMax));
            onMinChange(validValue);   
        } else {
            setMinInput(currentMin.toString());
        }
    };

    const handleMaxInputBlur = () => {
        const value = parseFloat(maxInput);
        if (!isNaN(value)) {
            const validValue = Math.min(maxValue, Math.max(value, currentMin));
            onMaxChange(validValue);   
        } else {
            setMaxInput(currentMax.toString());
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.rangeRow}>

                <div className={styles.valueContainer}>
                    {editable ? (
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                value={minInput}
                                onChange={handleMinInputChange}
                                onBlur={handleMinInputBlur}
                                className={styles.input}
                                aria-label="Minimum value"
                            />
                            <span className={styles.currency}>€</span>
                        </div>
                    ) : (
                        <span className={styles.label}>{formatValue(currentMin)}</span>
                    )}
                </div>

                <div className={styles.rangeWrapper}> 
                    <div
                        ref={rangeRef}
                        className={styles.rangeTrack}
                    >
                        <div
                            className={styles.rangeActive}
                            style={{
                                left: `${minPercentage}%`,
                                width: `${maxPercentage - minPercentage}%`,
                            }}
                        />

                        <div
                            className={`${styles.handle} ${isDragging === 'min' ? styles.handleDragging : ''}`}
                            style={{ left: `${minPercentage}%` }}
                            onMouseDown={handleMouseDown('min')}
                            onTouchStart={handleTouchStart('min')}
                            role="slider"
                            tabIndex={0}
                            aria-label="Minimum handle"
                            aria-valuemin={minValue}
                            aria-valuemax={currentMax}
                            aria-valuenow={currentMin}
                        />
                        <div
                            className={`${styles.handle} ${isDragging === 'max' ? styles.handleDragging : ''}`}
                            style={{ left: `${maxPercentage}%` }}
                            onMouseDown={handleMouseDown('max')}
                            onTouchStart={handleTouchStart('max')}
                            role="slider"
                            tabIndex={0}
                            aria-label="Maximum handle"
                            aria-valuemin={currentMin}
                            aria-valuemax={maxValue}
                            aria-valuenow={currentMax}
                        />                
                    </div>
                </div>

                <div className={styles.valueContainer}>
                    {editable ? (
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                value={maxInput}
                                onChange={handleMaxInputChange}
                                onBlur={handleMaxInputBlur}
                                className={styles.input}
                                aria-label="Maximum value"
                            />
                            <span className={styles.currency}>€</span>
                        </div>
                    ) : (
                        <span className={styles.label}>{formatValue(currentMax)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
                   