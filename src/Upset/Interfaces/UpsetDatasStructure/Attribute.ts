import { mean, median, quantile } from 'd3';

export interface Attribute {
  name: string;
  sort: number;
  type: string;
  values: any[];
  min?: number;
  max?: number;
}

export type Stats = {
  mean: number;
  median: number;
  min: number;
  max: number;
  lowerOutlier: number[];
  upperOutlier: number[];
  quantile: {
    first: number;
    second: number;
    third: number;
    IQR: number;
  };
};

export function getStats(values: number[]): Stats {
  let vals = [...values];
  vals.sort((a, b) => a - b);

  const first = quantile(vals, 0.25) || 0;
  const second = quantile(vals, 0.5) || 0;
  const third = quantile(vals, 0.75) || 0;
  const IQR = third - first;

  const outlierLimit = 1.5 * IQR;

  const min = Math.min(...vals);
  const max = Math.max(...vals);

  const lowerOutlier = vals.filter(v => v < first - outlierLimit).filter(d => d !== min);

  const upperOutlier = vals.filter(v => v > third + outlierLimit).filter(d => d !== max);

  return {
    mean: mean(vals) || 0,
    median: median(vals) || 0,
    min,
    max,
    lowerOutlier,
    upperOutlier,
    quantile: {
      first,
      second,
      third,
      IQR
    }
  };
}

export type Attributes = Attribute[];
