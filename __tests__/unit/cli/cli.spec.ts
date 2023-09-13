import path from 'path'
import { run } from '../../../src/cli/cli.js'
import { addCommentsPerFile } from '../../../src/add-comment/index.js'
import { generateMarkdownFromCommentedCode } from '../../../src/generate-doc/index.js'
import { getHandlerPaths } from '../../../src/plugins/serverless/index.js'
import { initializeOpenAI } from '../../../src/llm/model.js'
import { toJestMock } from '../../../src/utils/mockType.js'

jest.mock('../../../src/add-comment/index.js')
jest.mock('../../../src/generate-doc/index.js')
jest.mock('../../../src/plugins/serverless/index.js')
jest.mock('../../../src/llm/model.js')

describe('CLI Unit', () => {
  const config = {
    baseDir: path.resolve(process.cwd(), 'fake/folder'),
    deleteTmpFolder: true,
    tmpFolderPath: '',
    entryPoint: undefined,
    isMocked: false,
    openAi: { modelName: undefined, temperature: undefined },
    outputDir: path.resolve(process.cwd(), 'fakeFolderOutput'),
    serverlessEntryPoint: 'fake/folder/serverless.yml'
  }

  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'test-key'
    toJestMock(getHandlerPaths).mockReturnValue([
      'fakePath1.js',
      'fakePath2.js'
    ])
    toJestMock(addCommentsPerFile).mockImplementation(() => '/tmp/commented')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should throw an error when no OPENAI_API_KEY is found', async () => {
    process.env.OPENAI_API_KEY = ''

    await expect(async () => {
      await run([])
    }).rejects.toThrow('Missing OPENAI_API_KEY in env')
  })

  it('Should call initializeOpenAI', async () => {
    await run([
      '--temperature',
      '10',
      '--modelName',
      'openAi',
      '--entrypoint',
      'fake/path.js',
      '--output',
      'fakeFolderOutput'
    ])
    expect(initializeOpenAI).toHaveBeenCalledWith({
      temperature: 10,
      modelName: 'openAi'
    })
  })

  it('Should throw an error when output args is missing', async () => {
    await expect(async () => {
      await run([])
    }).rejects.toThrow('An outpath path is required')
  })

  it('Should throw an error when neither serverless of entrypoint are passed', async () => {
    await expect(async () => {
      await run(['--output', 'fakeFolderOutput'])
    }).rejects.toThrow('You have to pass an entrypoint or a serverless path')
  })

  it('Should call getHandlerPaths when serverless option is passed', async () => {
    await run([
      '--serverless',
      'fake/folder/serverless.yml',
      '--basedir',
      'fake/folder',
      '--output',
      'fakeFolderOutput'
    ])
    expect(getHandlerPaths).toHaveBeenCalledWith(
      'fake/folder/serverless.yml',
      path.resolve('fake/folder')
    )
  })

  it('Should call addCommentsPerFile with right params for serverless option', async () => {
    await run([
      '--serverless',
      'fake/folder/serverless.yml',
      '--basedir',
      'fake/folder',
      '--output',
      'fakeFolderOutput'
    ])
    expect(addCommentsPerFile).toHaveBeenCalledWith('fakePath1.js', config)
    expect(addCommentsPerFile).toHaveBeenCalledWith('fakePath2.js', config)
  })

  it('Should call addCommentsPerFile with right params for entrypoint option', async () => {
    await run([
      '--entrypoint',
      'fake/entry.js',
      '--basedir',
      'fake/folder',
      '--output',
      'fakeFolderOutput'
    ])
    expect(addCommentsPerFile).toHaveBeenCalledWith(
      path.resolve('fake/entry.js'),
      Object.assign({}, config, {
        entryPoint: 'fake/entry.js',
        serverlessEntryPoint: undefined
      })
    )
    expect(addCommentsPerFile).toHaveBeenCalledWith(
      path.resolve('fake/entry.js'),
      Object.assign({}, config, {
        entryPoint: 'fake/entry.js',
        serverlessEntryPoint: undefined
      })
    )
  })

  it('Should call generateMarkdownFromCommentedCode', async () => {
    await run([
      '--entrypoint',
      'fake/entry.js',
      '--basedir',
      'fake/folder',
      '--output',
      'fakeFolderOutput'
    ])
    expect(generateMarkdownFromCommentedCode).toHaveBeenCalledWith(
      '/tmp/commented',
      Object.assign({}, config, {
        entryPoint: 'fake/entry.js',
        serverlessEntryPoint: undefined
      })
    )
  })
})
