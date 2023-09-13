function dotProduct(vector1, vector2) {
  if (vector1.length != vector2.length) {
    throw new Error("Vectors are not the same dimensions.");
  }
  return vector1.reduce((sum, current, i) => sum + current * vector2[i], 0);
}
function crossProduct(vector1, vector2) {
  if (vector1.length != 3 || vector2.length != 3) {
    throw new Error("Cross product is only defined for 3D vectors.");
  }
  return [vector1[1] * vector2[2] - vector1[2] * vector2[1], vector1[2] * vector2[0] - vector1[0] * vector2[2], vector1[0] * vector2[1] - vector1[1] * vector2[0]];
}
function vectorMagnitude(vector) {
  return Math.sqrt(vector.reduce((sum, current) => sum + Math.pow(current, 2), 0));
}
module.exports = {
  dotProduct,
  crossProduct,
  vectorMagnitude
};