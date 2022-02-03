import * as d3 from 'd3';
import meta from './data-meta';
import { process } from './process';

export async function test() {
  const data = await d3.dsv(
    ';',
    'https://raw.githubusercontent.com/VCG/upset/master/data/movies/movies.csv',
  );
  return process(data, meta as any);
}

export * from './process';
export * from './types';
export * from './aggregate';
export * from './sort';
export * from './filter';
