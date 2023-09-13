const { matrixMultiplication, matrixAddition } = require('./under/a')
const { dotProduct, crossProduct, vectorMagnitude } = require('./outer/b')
function computeComplexOperation(matrixA, matrixB, vector1, vector2) {
  let matrixProduct = matrixMultiplication(matrixA, matrixB)
  let matrixSum = matrixAddition(matrixA, matrixB)
  let dotProd = dotProduct(vector1, vector2)
  let crossProd = crossProduct(vector1, vector2)
  let crossProdMagnitude = vectorMagnitude(crossProd)
  let weightedMatrixSum = matrixSum.map((row) =>
    row.map((value) => value * dotProd)
  )
  let resultMatrix = matrixMultiplication(weightedMatrixSum, matrixProduct)
  let finalMatrix = resultMatrix.map((row) =>
    row.map((value) => value * crossProdMagnitude)
  )
  return finalMatrix
}
module.exports = {
  computeComplexOperation
}
