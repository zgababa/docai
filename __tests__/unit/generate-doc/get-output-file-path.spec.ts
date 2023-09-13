import fs from 'fs'
import path from 'path'
import { getOutputFilePath } from '../../../src/generate-doc/get-output-file-path.js'

jest.mock('fs')
jest.mock('path')
jest.mock('url')

describe('getOutputFilePath', () => {
  beforeEach(() => {
    jest.spyOn(path, 'join').mockReturnValue('/mock/outputFilePath.md')
    jest.spyOn(path, 'extname').mockReturnValue('.js')
    jest.spyOn(fs, 'existsSync').mockReturnValue(false)
    jest.spyOn(fs, 'existsSync').mockReturnValue(false)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should generate the correct output file path', () => {
    const mockInputFilePath = '/originalDir/src/code.js'

    const result = getOutputFilePath(
      mockInputFilePath,
      '/originalDir',
      '/mock/websiteDir'
    )

    expect(path.join).toHaveBeenCalledWith('/mock/websiteDir', '/src/code.md')

    expect(result).toBe('/mock/outputFilePath.md')
  })

  it('Should create directory if it does not exist', () => {
    const mockInputFilePath = '/originalDir/src/code.js'

    const mkdirMock = jest.spyOn(fs, 'mkdirSync')

    getOutputFilePath(mockInputFilePath, '/originalDir', '/mock/websiteDir')

    expect(mkdirMock).toHaveBeenCalledWith(path.dirname(mockInputFilePath), {
      recursive: true
    })
  })

  it('Should not create directory if it exists', () => {
    const mockInputFilePath = '/originalDir/src/code.js'

    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    const mkdirMock = jest.spyOn(fs, 'mkdirSync')

    getOutputFilePath(mockInputFilePath, '/originalDir', '/mock/websiteDir')

    expect(mkdirMock).not.toHaveBeenCalled()
  })
})
