import fs from 'fs'
import { writeMarkdownFile } from '../../../src/generate-doc/write-markdown.js'
import { getMarkdown } from '../../../src/generate-doc/get-markdown.js'
import { getOutputFilePath } from '../../../src/generate-doc/get-output-file-path.js'
import { toJestMock } from '../../../src/utils/mockType.js'

jest.mock('fs')
jest.mock('../../../src/generate-doc/get-output-file-path')
jest.mock('../../../src/generate-doc/get-markdown')

describe('writeMarkdownFile', () => {
  const originalDir = 'originalDir'

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should throw an error if inputFilePath is empty', async () => {
    const fn = writeMarkdownFile(originalDir, {
      outputDir: '/mock/websiteDir'
    } as any)
    await expect(fn('')).rejects.toThrow('No input file path provided')
  })

  it('Should call helper functions and write markdown file', async () => {
    const inputFilePath = '/path/to/file.js'
    const codeContent = 'sample content'
    const title = 'file'
    const markdown = '# Sample Markdown'
    const outputFilePath = '/path/to/output.md'
    const markdownWithFunctions = '# Sample Markdown'

    toJestMock(fs.readFileSync).mockReturnValue(codeContent)
    toJestMock(getMarkdown).mockResolvedValue(markdown)
    toJestMock(getOutputFilePath).mockReturnValue(outputFilePath)

    const fn = writeMarkdownFile(originalDir, {
      outputDir: '/mock/websiteDir',
      isMocked: true,
      template: 'template'
    } as any)
    await fn(inputFilePath)

    expect(getMarkdown).toHaveBeenCalledWith(
      inputFilePath,
      codeContent,
      title,
      true,
      'template'
    )
    expect(getOutputFilePath).toHaveBeenCalledWith(
      inputFilePath,
      originalDir,
      '/mock/websiteDir'
    )
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      outputFilePath,
      markdownWithFunctions
    )
  })
})
