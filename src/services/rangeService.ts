import { NormalRangeResponse, FixedRangeResponse } from "@/types/range.types";

const simulateNetworkDelay = () => {
    const delay = Math.random() * 500 + 300; 
    return new Promise(resolve => setTimeout(resolve, delay));
};

export const fetchNormalRangeValues = async (): Promise<NormalRangeResponse> => {
    await simulateNetworkDelay();
    return {
        min: 1,
        max: 100,
    };
}

export const fetchFixedRangeValues = async (): Promise<FixedRangeResponse> => {
    await simulateNetworkDelay();
    return {
        rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]
    };
};
