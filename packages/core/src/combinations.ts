export function combinationsFromArray<T>(collection: T[], n: number) {
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
