export type RangeType = 'normal' | 'fixed';

export interface RangeProps {
    type: RangeType;
    minValue: number;
    maxValue: number;
    currentMin: number;
    currentMax: number;
    onMinChange: (value: number) => void;
    onMaxChange: (value: number) => void;
    step?: number;
    fixedValues?: number[];
    editable?: boolean;  
}

export interface NormalRangeResponse {
    min: number;
    max: number;
}

export interface FixedRangeResponse {
    rangeValues: number[];
}
