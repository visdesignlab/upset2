/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/**
 * Generates all combinations of length 'n' from an array of elements.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} collection - The array of elements.
 * @param {number} n - The length of combinations to generate.
 * @returns {T[][]} - An array of combinations of length 'n'.
 */
export function combinationsFromArray<T>(collection: T[], n: number) {
  const array: T[] = Object.values(collection);
  if (array.length < n) {
    return [];
  }
  const recur = (array: T[], n: number) => {
    // eslint-disable-next-line no-plusplus
    if (--n < 0) {
      return [[]];
    }
    const combinations: T[][] = [];
    array = array.slice();
    while (array.length - n) {
      const value = array.shift() as T;
      recur(array, n).forEach((combination) => {
        combination.unshift(value);
        combinations.push(combination);
      });
    }
    return combinations;
  };
  return recur(array, n);
}
