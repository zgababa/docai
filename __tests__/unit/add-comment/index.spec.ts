import dependencyTree from 'dependency-tree'
import path from 'path'
import fs from 'fs'

import { addCommentsPerFile } from '../../../src/add-comment/index.js'
import { moveFileToDirectory } from '../../../src/utils/file.js'
import { orderFilesByDeepestDependencies } from '../../../src/add-comment/order-files.js'
import { getPathAndDescription } from '../../../src/add-comment/get-path-and-description.js'
import { generateDescriptionByFile } from '../../../src/add-comment/generate-descriptions.js'
import { addDescriptionsToImports } from '../../../src/add-comment/add-descriptions.js'
import { toJestMock } from '../../../src/utils/mockType.js'

jest.mock('dependency-tree')
jest.mock('fs')
jest.mock('path')

jest.mock('../../../src/add-comment/order-files.js')
jest.mock('../../../src/add-comment/get-path-and-description.js')
jest.mock('../../../src/utils/file.js')
jest.mock('../../../src/add-comment/generate-descriptions.js')
jest.mock('../../../src/add-comment/add-descriptions.js')

describe('addComment', () => {
  const tree = {
    file1: {},
    file2: {}
  }
  const entryPoint = './entrypoint.js'
  const descriptions = {}

  beforeEach(() => {
    toJestMock(path.dirname).mockReturnValue('dirname')
    toJestMock(dependencyTree).mockReturnValue(tree)
    toJestMock(orderFilesByDeepestDependencies).mockReturnValue('treeOrdered')
    toJestMock(getPathAndDescription).mockReturnValue({
      tmpPath: 'tmpPath',
      descriptions
    })
    toJestMock(moveFileToDirectory).mockReturnValue(Object.keys(tree))
    toJestMock(generateDescriptionByFile).mockImplementation(
      (filePath: string) => () => ({
        filePath,
        fileContent: 'fileContent'
      })
    )
    toJestMock(addDescriptionsToImports).mockReturnValue('codeWithComments')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should create a tree with good params', async () => {
    await addCommentsPerFile(entryPoint, {
      baseDir: process.cwd()
    } as any)
    expect(dependencyTree).toHaveBeenCalledWith({
      filename: entryPoint,
      directory: 'dirname'
    })
  })
  it('Move files to comment to a tmp directory', async () => {
    await addCommentsPerFile(entryPoint, { baseDir: process.cwd() } as any)

    expect(orderFilesByDeepestDependencies).toHaveBeenCalledWith(tree)
    expect(moveFileToDirectory).toHaveBeenCalledWith(
      'treeOrdered',
      'tmpPath',
      process.cwd()
    )
  })
  it('Should call generateDescriptionByFile for each file into the tree', async () => {
    await addCommentsPerFile(entryPoint, { baseDir: process.cwd() } as any)

    expect(generateDescriptionByFile).toHaveBeenCalledWith(
      'file1',
      descriptions
    )
    expect(generateDescriptionByFile).toHaveBeenCalledWith(
      'file2',
      descriptions
    )
    expect(generateDescriptionByFile).toHaveBeenCalledTimes(2)
  })

  it('Should call addDescriptionsToImports for each file added with doc', async () => {
    await addCommentsPerFile(entryPoint, { baseDir: process.cwd() } as any)

    expect(addDescriptionsToImports).toHaveBeenCalledWith(
      'fileContent',
      'file1',
      descriptions
    )
    expect(addDescriptionsToImports).toHaveBeenCalledWith(
      'fileContent',
      'file2',
      descriptions
    )
    expect(addDescriptionsToImports).toHaveBeenCalledTimes(2)
  })

  it('Should write file for each file added with doc', async () => {
    await addCommentsPerFile(entryPoint, { baseDir: process.cwd() } as any)

    expect(fs.writeFileSync).toHaveBeenCalledWith('file1', 'codeWithComments')
    expect(fs.writeFileSync).toHaveBeenCalledWith('file2', 'codeWithComments')
    expect(fs.writeFileSync).toHaveBeenCalledTimes(2)
  })
})
