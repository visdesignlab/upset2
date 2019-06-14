import * as hash from "object-hash";

export function HashCode(obj: any): string {
  return hash.sha1(obj);
}
