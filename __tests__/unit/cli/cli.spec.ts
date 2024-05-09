import path from 'path'
import { cli } from '../../../src/cli/cli.js'
import { addCommentsPerFile } from '../../../src/add-comment/index.js'
import { generateMarkdownFromCommentedCode } from '../../../src/generate-doc/index.js'
import { getHandlerPaths } from '../../../src/plugins/serverless/index.js'
import { initializeModel } from '../../../src/llm/model.js'
import { toJestMock } from '../../../src/utils/mockType.js'
import { PROVIDER_LIST } from '../../../src/utils/contants.js'

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
    llm: {
      modelName: 'mistral-tiny',
      modelProvider: 'mistral',
      temperature: undefined,
      apiKey: 'test-key'
    },
    outputDir: path.resolve(process.cwd(), 'fakeFolderOutput'),
    serverlessEntryPoint: 'fake/folder/serverless.yml',
    files: []
  }

  beforeEach(() => {
    process.env.API_KEY = 'test-key'
    toJestMock(getHandlerPaths).mockReturnValue([
      'fakePath1.js',
      'fakePath2.js'
    ])
    toJestMock(addCommentsPerFile).mockImplementation(() => '/tmp/commented')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should throw an error when no API_KEY is found', async () => {
    process.env.API_KEY = ''

    await expect(async () => {
      await cli([])
    }).rejects.toThrow('You have to provide an API_KEY')
  })

  it('Should no throw an error when API_KEY is missing in local mode', async () => {
    process.env.API_KEY = ''

    await expect(async () => {
      await cli(['--local'])
    }).rejects.not.toThrow('You have to provide an API_KEY')
  })

  it('Should call initializeModel with llm', async () => {
    await cli([
      '--temperature',
      '10',
      '--modelName',
      'gpt-4',
      '--modelProvider',
      'openAI',
      '--entrypoint',
      'fake/path.js',
      '--output',
      'fakeFolderOutput'
    ])
    expect(initializeModel).toHaveBeenCalledWith({
      baseDir: '',
      deleteTmpFolder: true,
      entryPoint: 'fake/path.js',
      files: [],
      isMocked: false,
      llm: {
        apiKey: 'test-key',
        temperature: 10,
        modelName: 'gpt-4',
        modelProvider: 'openAI'
      },
      outputDir: 'fakeFolderOutput',
      serverlessEntryPoint: undefined,
      tmpFolderPath: ''
    })
  })

  it('Should call initializeModel with local when local args is passed', async () => {
    await cli([
      '--temperature',
      '10',
      '--modelName',
      'llama2',
      '--modelProvider',
      'openAI',
      '--entrypoint',
      'fake/path.js',
      '--output',
      'fakeFolderOutput',
      '--local',
      '--baseUrl',
      'http://localhost:1234'
    ])
    expect(initializeModel).toHaveBeenCalledWith({
      baseDir: '',
      deleteTmpFolder: true,
      entryPoint: 'fake/path.js',
      files: [],
      isMocked: false,
      local: {
        modelName: 'llama2',
        baseUrl: 'http://localhost:1234'
      },
      outputDir: 'fakeFolderOutput',
      serverlessEntryPoint: undefined,
      tmpFolderPath: ''
    })
  })

  it('Should throw an error when no modelProvider is passed', async () => {
    await expect(async () => {
      await cli(['--output', 'fakeFolderOutput'])
    }).rejects.toThrow(
      `Only ${PROVIDER_LIST.join(
        ', '
      )} llm are supported. Please choose one with modelProvider argument`
    )
  })

  it('Should no throw an error when modelProvider is missing in local mode', async () => {
    await expect(async () => {
      await cli(['--local'])
    }).rejects.not.toThrow(
      `Only ${PROVIDER_LIST.join(
        ', '
      )} llm are supported. Please choose one with modelProvider argument`
    )
  })

  it('Should throw an error when output is missing', async () => {
    await expect(async () => {
      await cli(['--modelProvider', 'mistral'])
    }).rejects.toThrow('An outpath path is required')
  })

  it('Should throw an error when no modelName is passed', async () => {
    await expect(async () => {
      await cli(['--output', 'fakeFolderOutput', '--modelProvider', 'mistral'])
    }).rejects.toThrow(
      'A modelName is required. Please fill modelName argument'
    )
  })

  it('Should throw an error when neither serverless of entrypoint are passed', async () => {
    await expect(async () => {
      await cli([
        '--output',
        'fakeFolderOutput',
        '--modelProvider',
        'mistral',
        '--modelName',
        'mistral-tiny'
      ])
    }).rejects.toThrow('You have to pass an entrypoint or a serverless path')
  })

  it('Should call getHandlerPaths when serverless option is passed', async () => {
    await cli([
      '--serverless',
      'fake/folder/serverless.yml',
      '--basedir',
      'fake/folder',
      '--output',
      'fakeFolderOutput',
      '--modelProvider',
      'mistral',
      '--modelName',
      'mistral-tiny'
    ])
    expect(getHandlerPaths).toHaveBeenCalledWith(
      path.resolve('fake/folder/serverless.yml'),
      path.resolve('fake/folder')
    )
  })

  it('Should call addCommentsPerFile with right params for serverless option', async () => {
    await cli([
      '--serverless',
      'fake/folder/serverless.yml',
      '--basedir',
      'fake/folder',
      '--output',
      'fakeFolderOutput',
      '--modelProvider',
      'mistral',
      '--modelName',
      'mistral-tiny'
    ])
    expect(addCommentsPerFile).toHaveBeenCalledWith('fakePath1.js', config)
    expect(addCommentsPerFile).toHaveBeenCalledWith('fakePath2.js', config)
  })

  it('Should call addCommentsPerFile with right params for entrypoint option', async () => {
    await cli([
      '--entrypoint',
      'fake/entry.js',
      '--basedir',
      'fake/folder',
      '--output',
      'fakeFolderOutput',
      '--modelProvider',
      'mistral',
      '--modelName',
      'mistral-tiny'
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
    await cli([
      '--entrypoint',
      'fake/entry.js',
      '--basedir',
      'fake/folder',
      '--output',
      'fakeFolderOutput',
      '--modelProvider',
      'mistral',
      '--modelName',
      'mistral-tiny'
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
