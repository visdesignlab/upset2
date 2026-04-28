/**
 * Generates all combinations of length 'n' from an array of elements.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} collection - The array of elements.
 * @param {number} n - The length of combinations to generate.
 * @returns {T[][]} - An array of combinations of length 'n'.
 */
export function combinationsFromArray<T>(collection: T[], n: number): T[][] {
  const input: T[] = Object.values(collection);
  if (input.length < n) {
    return [];
  }
  const recur = (array: T[], innerN: number) => {
    const nextN = innerN - 1;
    if (nextN < 0) {
      return [[]];
    }
    const combinations: T[][] = [];
    const remaining = array.slice();
    while (remaining.length > nextN) {
      const value = remaining.shift();
      recur(remaining, nextN).forEach((combination) => {
        if (value !== undefined) combination.unshift(value);
        combinations.push(combination);
      });
    }
    return combinations;
  };
  return recur(input, n);
}
