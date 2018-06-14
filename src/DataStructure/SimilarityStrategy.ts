export enum Similarity {
  JACCARD = "JACCARD",
  SORENSON = "SORENSON"
}

let SimilarityStrategy: {
  [key: string]: (int: number, l1: number, l2: number) => number;
} = {};

SimilarityStrategy[Similarity.JACCARD] = JaccardIndex;
SimilarityStrategy[Similarity.SORENSON] = SorensonDiceCoefficent;

export default SimilarityStrategy;

function JaccardIndex(
  intersection: number,
  length1: number,
  length2: number
): number {
  let union = length1 + length2 - intersection;
  if (union === 0) return 1;
  return intersection / union;
}

function SorensonDiceCoefficent(
  intersection: number,
  length1: number,
  length2: number
): number {
  let j = JaccardIndex(intersection, length1, length2);
  return (2 * j) / (1 + j);
}
