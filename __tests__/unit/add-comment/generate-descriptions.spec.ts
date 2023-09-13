import fs from 'fs'

import llm from '../../../src/llm/llm.js'
import { generateDescriptionByFile } from '../../../src/add-comment/generate-descriptions.js'

jest.mock('fs', () => {
  return {
    readFileSync: jest.fn(() => 'FILE_CONTENT')
  }
})

describe('generateDescriptionByFile', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const FILE_PATH = 'path/to/file.js'
  const descriptions = { [FILE_PATH]: 'description' }

  it('Should throw an error when no file path is provided', async () => {
    await expect(generateDescriptionByFile('', {})()).rejects.toThrow(
      'No file path is provided'
    )
  })
  it('Should read the file', async () => {
    await generateDescriptionByFile(FILE_PATH, descriptions)()

    expect(fs.readFileSync).toHaveBeenCalledWith(FILE_PATH, 'utf8')
  })
  it('Should not generate a description when a description exist', async () => {
    llm.generateCommentFromCode = jest.fn()
    await generateDescriptionByFile(FILE_PATH, descriptions)()
    expect(llm.generateCommentFromCode).toBeCalledTimes(0)
  })
  it('Should generate a description when no one exist', async () => {
    llm.generateCommentFromCode = jest.fn()
    await generateDescriptionByFile(FILE_PATH, {})()
    expect(llm.generateCommentFromCode).toBeCalledTimes(1)
    expect(llm.generateCommentFromCode).toHaveBeenCalledWith('FILE_CONTENT')
  })
  it('Should return fileContent, filePath, descriptions', async () => {
    llm.generateCommentFromCode = jest.fn()
    const result = await generateDescriptionByFile(FILE_PATH, descriptions)()
    expect(result).toEqual({
      fileContent: 'FILE_CONTENT',
      filePath: FILE_PATH,
      descriptions
    })
  })
})
