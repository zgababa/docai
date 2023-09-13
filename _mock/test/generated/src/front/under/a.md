# a

## Description

This file contains three functions to perform operations on matrices: matrix addition, matrix multiplication, and matrix transposition.

The `matrixAddition(matrixA, matrixB)` function takes two matrices as parameters and returns a new matrix that is the result of adding the two matrices.

The `matrixMultiplication(matrixA, matrixB)` function takes two matrices as parameters and returns a new matrix that is the result of multiplying the two matrices.

The `matrixTranspose(matrix)` function takes a matrix as its parameter and returns a new matrix that is the transpose of the original matrix.

## Code

```javascript
function matrixAddition(matrixA, matrixB) {
  let result = []
  for (let i = 0; i < matrixA.length; i++) {
    result[i] = []
    for (let j = 0; j < matrixA[0].length; j++) {
      result[i][j] = matrixA[i][j] + matrixB[i][j]
    }
  }
  return result
}

function matrixMultiplication(matrixA, matrixB) {
  let result = []
  for (let i = 0; i < matrixA.length; i++) {
    result[i] = []
    for (let j = 0; j < matrixB[0].length; j++) {
      let sum = 0
      for (let k = 0; k < matrixA[0].length; k++) {
        sum += matrixA[i][k] * matrixB[k][j]
      }
      result[i][j] = sum
    }
  }
  return result
}

function matrixTranspose(matrix) {
  let result = []
  for (let i = 0; i < matrix[0].length; i++) {
    result[i] = []
    for (let j = 0; j < matrix.length; j++) {
      result[i][j] = matrix[j][i]
    }
  }
  return result
}

module.exports = {
  matrixAddition,
  matrixMultiplication,
  matrixTranspose
}
```

## Usage Example

```javascript
const matrices = require('./matrices')

const matrixA = [
  [1, 2],
  [3, 4]
]
const matrixB = [
  [5, 6],
  [7, 8]
]

const additionResult = matrices.matrixAddition(matrixA, matrixB)
console.log(additionResult)
// Output: [[6, 8], [10, 12]]

const multiplicationResult = matrices.matrixMultiplication(matrixA, matrixB)
console.log(multiplicationResult)
// Output: [[19, 22], [43, 50]]

const transposeResult = matrices.matrixTranspose(matrixA)
console.log(transposeResult)
// Output: [[1, 3], [2, 4]]
```
