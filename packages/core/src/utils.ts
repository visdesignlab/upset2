/**
 * DEPRECATED: Currently serves only as an alias for structuredClone; use that instead.
 * Create a deep copy (with all fields recursively copied) of an object
 * @param obj the object to copy
 * @returns a deep copy of the object
 */
export function deepCopy<T extends object>(obj: T): T {
  return structuredClone(obj);
}

/**
 * Hash a string to a number
 * @param str the string to hash
 * @returns the hash of the string
 */
export function hashString(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
  }
  return hash;
}
