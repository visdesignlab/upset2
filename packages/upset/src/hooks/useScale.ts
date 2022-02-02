import React, { useMemo } from 'react';
import { scaleLinear } from 'd3';

export function useScale(domain: [number, number], range: [number, number]) {
  return useMemo(() => {
    return scaleLinear().domain(domain).range(range);
  }, [domain, range]);
}
