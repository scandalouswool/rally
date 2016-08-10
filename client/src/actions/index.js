export function selectAlgorithm(algorithm) {
  return {
    type: 'ALGORITHM_SELECTED',
    payload: algorithm
  }
}