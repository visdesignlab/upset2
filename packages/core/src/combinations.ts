export function combinationsFromArray<T>(collection: T[], n: number) {
  let array: T[] = Object.values(collection);
  if (array.length < n) {
    return [];
  }
  let recur = (array: T[], n: number) => {
    if (--n < 0) {
      return [[]];
    }
    let combinations: T[][] = [];
    array = array.slice();
    while (array.length - n) {
      let value = array.shift() as T;
      recur(array, n).forEach((combination) => {
        combination.unshift(value);
        combinations.push(combination);
      });
    }
    return combinations;
  };
  return recur(array, n);
}
