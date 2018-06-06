export class SimilarityFunctions {
  static JaccardIndex(
    intersection: number,
    length1: number,
    length2: number
  ): number {
    let union = length1 + length2 - intersection;
    if (union === 0) return 1;
    return intersection / union;
  }

  static SorensonDiceCoefficent(
    intersection: number,
    length1: number,
    length2: number
  ): number {
    let j = SimilarityFunctions.JaccardIndex(intersection, length1, length2);
    return 2 * j / (1 + j);
  }
}
