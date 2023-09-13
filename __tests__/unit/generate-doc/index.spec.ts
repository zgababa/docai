import { generateMarkdownFromCommentedCode } from '../../../src/generate-doc/index.js'
import { getFilesFromFolder, cleanFolder } from '../../../src/utils/file.js'
import { writeMarkdownFile } from '../../../src/generate-doc/write-markdown.js'
import { toJestMock } from '../../../src/utils/mockType.js'

jest.mock('fs')
jest.mock('../../../src/utils/file')
jest.mock('../../../src/generate-doc/write-markdown')

describe('generateMarkdownFromCommentedCode', () => {
  const tmpDirectoryPath = '/fake/tmp/path'
  const mockFiles = ['path1', 'path2']

  beforeEach(() => {
    toJestMock(getFilesFromFolder).mockReturnValue(mockFiles)
    toJestMock(writeMarkdownFile).mockImplementation(() => () => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should call cleanFolder', async () => {
    const config: any = { outputDir: '/mock/websiteDir' }
    await generateMarkdownFromCommentedCode(tmpDirectoryPath, config)

    expect(cleanFolder).toBeCalledTimes(1)
    expect(cleanFolder).toHaveBeenCalledWith('/mock/websiteDir')
  })

  it('Should call getFilesFromFolder with the correct parameter', async () => {
    const config: any = { outputDir: '/mock/websiteDir' }
    await generateMarkdownFromCommentedCode(tmpDirectoryPath, config)

    expect(getFilesFromFolder).toHaveBeenCalledWith(tmpDirectoryPath)
  })

  it('Should call writeMarkdownFile with the correct parameters', async () => {
    const config: any = { outputDir: '/mock/websiteDir' }
    await generateMarkdownFromCommentedCode(tmpDirectoryPath, config)

    mockFiles.forEach(() => {
      expect(writeMarkdownFile).toHaveBeenCalledWith(tmpDirectoryPath, config)
    })
  })

  it('Should call deleteFolder with the correct parameter', async () => {
    const config: any = { outputDir: '/mock/websiteDir' }
    await generateMarkdownFromCommentedCode(tmpDirectoryPath, config)
  })
})
