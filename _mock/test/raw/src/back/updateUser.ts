import { computeComplexOperation } from '../front/x'

export const updateUser = async (_event: any) => {
  let matrixA = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ]
  let matrixB = [
    [10, 11, 12],
    [13, 14, 15],
    [16, 17, 18]
  ]
  let vector1 = [1, 2, 3]
  let vector2 = [4, 5, 6]
  const users = computeComplexOperation(matrixA, matrixB, vector1, vector2)
  return {
    statusCode: 200,
    body: JSON.stringify({
      users: [users]
    })
  }
}

export default updateUser
