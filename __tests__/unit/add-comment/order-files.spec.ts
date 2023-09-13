import { orderFilesByDeepestDependencies } from '../../../src/add-comment/order-files.js'

describe('orderFilesByDeepestDependencies', () => {
  it('Should return the file path as an array if the tree is a string', () => {
    const tree = 'path/to/file'
    const result = orderFilesByDeepestDependencies(tree)
    expect(result).toEqual(['path/to/file'])
  })

  it('Should return an ordered array for nested dependencies', () => {
    const tree = {
      file1: {
        file2: {
          file3: {}
        }
      }
    }
    const result = orderFilesByDeepestDependencies(tree)
    expect(result).toEqual(['file3', 'file2', 'file1'])
  })

  it('Should return an ordered array for complex dependencies', () => {
    const tree = {
      file1: {
        file2: {},
        file3: {
          file4: {}
        }
      },
      file5: {}
    }
    const result = orderFilesByDeepestDependencies(tree)
    expect(result).toEqual(['file2', 'file4', 'file3', 'file1', 'file5'])
  })

  it('Should return an empty array for an empty tree', () => {
    const tree = {}
    const result = orderFilesByDeepestDependencies(tree)
    expect(result).toEqual([])
  })
})
