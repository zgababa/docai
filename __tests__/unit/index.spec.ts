import path from 'path'
import { docai } from '../../src/index'
import { addCommentsPerFile } from '../../src/add-comment/index.js'
import { generateMarkdownFromCommentedCode } from '../../src/generate-doc/index.js'
import { getHandlerPaths } from '../../src/plugins/serverless/index.js'
import { initializeModel } from '../../src/llm/model.js'
import type { EntryConfigDocai } from '../../src/types/internal'
import { writeMarkdownFile } from '../../src/generate-doc/write-markdown.js'
import { toJestMock } from '../../src/utils/mockType.js'

jest.mock('../../src/add-comment/index.js')
jest.mock('../../src/generate-doc/index.js')
jest.mock('../../src/generate-doc/write-markdown.js')
jest.mock('../../src/plugins/serverless/index.js')
jest.mock('../../src/llm/model.js')

describe('Docai index', () => {
  const mockConfig: EntryConfigDocai = {
    outputDir: 'fakeFolderOutput',
    baseDir: 'baseDir',
    llm: {
      apiKey: 'test-key',
      modelName: 'gpt-4',
      modelProvider: 'openAI'
    }
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should throw an error when outputDir is missing', async () => {
    const config = { ...mockConfig, outputDir: undefined }
    await expect(docai(config as any)).rejects.toThrow(
      'An outpath directory is required'
    )
  })

  it('should throw an error when apiKey is missing', async () => {
    const config = { ...mockConfig, llm: { foo: 'bar' } }
    await expect(docai(config as any)).rejects.toThrow(
      'An API KEY is required. Please fill llm.apiKey'
    )
  })

  it('should throw an error when no entry point is provided', async () => {
    const config = {
      ...mockConfig,
      entryPoint: undefined,
      serverlessEntryPoint: undefined,
      files: []
    }
    await expect(docai(config as any)).rejects.toThrow(
      'You have to pass an entryPoint or a serverlessEntryPoint or an array of files'
    )
  })

  it('should throw an error when llm and local properties are provided', async () => {
    const config = {
      ...mockConfig,
      local: {
        foo: 'bar'
      },
      llm: {
        bar: 'foo'
      }
    }
    await expect(docai(config as any)).rejects.toThrow(
      'You can not have local and llm property together, please choose one'
    )
  })

  it('should initialize the model with correct parameters', async () => {
    await docai({ ...mockConfig, entryPoint: 'test.js' })
    expect(initializeModel).toHaveBeenCalledWith({
      ...mockConfig,
      entryPoint: 'test.js'
    })
  })

  it('should call writeMarkdownFile for each path in files', async () => {
    const config = {
      ...mockConfig,
      entryPoint: undefined,
      files: ['/tmp/handlerPath1.js', '/tmp/handlerPath2.js']
    }
    toJestMock(writeMarkdownFile).mockImplementation(() => () => {})

    await docai(config)

    expect(writeMarkdownFile).toHaveBeenCalledWith('/tmp', expect.any(Object))
    expect(writeMarkdownFile).toHaveBeenCalledWith('/tmp', expect.any(Object))
    expect(addCommentsPerFile).toHaveBeenCalledTimes(0)
    expect(generateMarkdownFromCommentedCode).toHaveBeenCalledTimes(0)
  })

  it('should call addCommentsPerFile for entryPoint path', async () => {
    const config = {
      ...mockConfig,
      entryPoint: 'handlerPath1.js',
      files: []
    }

    await docai(config)

    expect(addCommentsPerFile).toHaveBeenCalledWith(
      path.resolve('handlerPath1.js'),
      expect.any(Object)
    )
  })

  it('should call addCommentsPerFile for all serverlessEntryPoint paths', async () => {
    const config = {
      ...mockConfig,
      serverlessEntryPoint: 'serverless.yml',
      files: []
    }

    toJestMock(getHandlerPaths).mockReturnValue([
      path.resolve('fakePath1.js'),
      path.resolve('fakePath2.js')
    ])

    await docai(config)

    expect(getHandlerPaths).toHaveBeenCalledWith(
      path.resolve('serverless.yml'),
      path.resolve('baseDir')
    )

    expect(addCommentsPerFile).toHaveBeenCalledWith(
      path.resolve('fakePath1.js'),
      expect.any(Object)
    )

    expect(addCommentsPerFile).toHaveBeenCalledWith(
      path.resolve('fakePath2.js'),
      expect.any(Object)
    )
  })

  it('should call generateMarkdownFromCommentedCode with correct parameters', async () => {
    toJestMock(addCommentsPerFile).mockImplementation(() => '/tmp/commented')
    await docai({ ...mockConfig, entryPoint: 'test.js' })
    expect(generateMarkdownFromCommentedCode).toHaveBeenCalledWith(
      '/tmp/commented',
      expect.any(Object)
    )
  })
})
