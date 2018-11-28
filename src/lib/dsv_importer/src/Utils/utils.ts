export function isValidEmail(email: string) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const stringIsNumber = (val: any) => isNaN(Number(val)) === false;

export function enumToArray(enm: any) {
  return Object.keys(enm)
    .filter(stringIsNumber)
    .map(k => {
      return {
        key: k,
        value: enm[k]
      };
    });
}

export function FilterWithIndices<T>(
  arr: Array<T>,
  predicate: Function
): Array<number> {
  let temp: Array<number> = [];
  arr.forEach((item, idx) => {
    if (predicate(item)) temp.push(idx);
  });
  return temp;
}
