# b

## Description

This file contains three functions to perform operations on vectors.

The `dotProduct` function calculates the dot product of two vectors. It takes as parameters two vectors `vector1` and `vector2` and first checks if both vectors are of the same dimension. If not, an error is thrown. Otherwise, the function uses the `reduce` method to iterate over the vector elements and compute the dot product. The result is returned.

The `crossProduct` function calculates the cross product of two 3D vectors. It takes as parameters two vectors `vector1` and `vector2` and first checks if both vectors are of dimension 3. If not, an error is thrown. Otherwise, the function performs the cross product calculation using the appropriate mathematical formulas. The result is returned as a new vector.

The `vectorMagnitude` function calculates the magnitude (or norm) of a vector. It takes a vector `vector` as its parameter and uses the `reduce` method to iterate over the vector's elements and compute its magnitude. The result is returned.

All three functions are exported at the end of the file to be used in other JavaScript files.

## Code

```javascript
function dotProduct(vector1, vector2) {
  if (vector1.length != vector2.length) {
    throw new Error('Vectors are not the same dimensions.')
  }
  return vector1.reduce((sum, current, i) => sum + current * vector2[i], 0)
}

function crossProduct(vector1, vector2) {
  if (vector1.length != 3 || vector2.length != 3) {
    throw new Error('Cross product is only defined for 3D vectors.')
  }
  return [
    vector1[1] * vector2[2] - vector1[2] * vector2[1],
    vector1[2] * vector2[0] - vector1[0] * vector2[2],
    vector1[0] * vector2[1] - vector1[1] * vector2[0]
  ]
}

function vectorMagnitude(vector) {
  return Math.sqrt(
    vector.reduce((sum, current) => sum + Math.pow(current, 2), 0)
  )
}

module.exports = {
  dotProduct,
  crossProduct,
  vectorMagnitude
}
```

## Usage Example

```javascript
const vectors = require('./vectors')

const vector1 = [1, 2, 3]
const vector2 = [4, 5, 6]

const dotProductResult = vectors.dotProduct(vector1, vector2)
console.log(dotProductResult) // Output: 32

const crossProductResult = vectors.crossProduct(vector1, vector2)
console.log(crossProductResult) // Output: [-3, 6, -3]

const vectorMagnitudeResult = vectors.vectorMagnitude(vector1)
console.log(vectorMagnitudeResult) // Output: 3.7416573867739413
```
