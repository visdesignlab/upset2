import { sum } from 'd3';

export default function isSubsetMemberOfGroup(
  subsetMembership: number[],
  groupMembership: number[]
): boolean {
  if (sum([...new Set(subsetMembership)]) > 1 || sum([...new Set(groupMembership)]) > 1) {
    throw new Error('Not a bit array');
  }

  const subsetBit = parseInt(subsetMembership.join(''), 2);
  const groupBit = parseInt(groupMembership.join(''), 2);

  return (subsetBit & groupBit) === groupBit;
}
