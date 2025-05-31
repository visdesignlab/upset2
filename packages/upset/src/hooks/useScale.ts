import { scaleLinear } from 'd3-scale';
import { useMemo } from 'react';

/**
 * Given a domain and range, returns a function that maps values from the domain to the range on a linear scale.
 * @param domain [min, max] pair defining the input domain (x)
 * @param range [min, max] pair defining the output range (y)
 * @returns A function that takes a number in the domain and returns a number in the range
 */
export function useScale(domain: [number, number], range: [number, number]) {
  return useMemo(() => scaleLinear().domain(domain).range(range), [domain, range]);
}
