function matrixAddition(matrixA, matrixB) {
  let result = [];
  for (let i = 0; i < matrixA.length; i++) {
    result[i] = [];
    for (let j = 0; j < matrixA[0].length; j++) {
      result[i][j] = matrixA[i][j] + matrixB[i][j];
    }
  }
  return result;
}
function matrixMultiplication(matrixA, matrixB) {
  let result = [];
  for (let i = 0; i < matrixA.length; i++) {
    result[i] = [];
    for (let j = 0; j < matrixB[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < matrixA[0].length; k++) {
        sum += matrixA[i][k] * matrixB[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}
function matrixTranspose(matrix) {
  let result = [];
  for (let i = 0; i < matrix[0].length; i++) {
    result[i] = [];
    for (let j = 0; j < matrix.length; j++) {
      result[i][j] = matrix[j][i];
    }
  }
  return result;
}
module.exports = {
  matrixAddition,
  matrixMultiplication,
  matrixTranspose
};