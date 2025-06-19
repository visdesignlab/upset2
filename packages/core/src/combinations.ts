/**
 * Generates all combinations of length 'n' from an array of elements.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} collection - The array of elements.
 * @param {number} n - The length of combinations to generate.
 * @returns {T[][]} - An array of combinations of length 'n'.
 */
export function combinationsFromArray<T>(collection: T[], n: number): T[][] {
  const array: T[] = Object.values(collection);
  if (array.length < n) {
    return [];
  }
  const recur = (array: T[], n: number) => {
    if (--n < 0) {
      return [[]];
    }
    const combinations: T[][] = [];
    array = array.slice();
    while (array.length - n) {
      const value = array.shift();
      recur(array, n).forEach((combination) => {
        if (value) combination.unshift(value);
        combinations.push(combination);
      });
    }
    return combinations;
  };
  return recur(array, n);
}
