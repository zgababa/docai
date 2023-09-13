import fs from 'fs'

import { toJestMock } from '../../../src/utils/mockType.js'
import { getMarkdown } from '../../../src/generate-doc/get-markdown.js'
import { generateMarkdown } from '../../../src/llm/llm.js'

jest.mock('fs')
jest.mock('../../../src/llm/llm.js')
jest.mock('../../../_mock/mock-config.js', () => ({
  cache: {
    '/src/back/getUsers.js': '/src/back/getUsers.md'
  }
}))

describe('getMarkdown', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should return the cached markdown if available and MOCKED is true', async () => {
    const mockedReadFileSync = jest.spyOn(fs, 'readFileSync')
    mockedReadFileSync.mockReturnValue('Cached Markdown Content')

    const result = await getMarkdown(
      '/src/back/getUsers.js',
      'codeContent',
      'title',
      true
    )

    expect(result).toBe('Cached Markdown Content')
    expect(mockedReadFileSync).toHaveBeenCalledWith(
      '/src/back/getUsers.md',
      'utf-8'
    )
  })

  it('Should throw an error if file path is not in cache and MOCKED is true', async () => {
    await expect(
      getMarkdown('not-in-cache.js', 'codeContent', 'title', true)
    ).rejects.toThrow('Error in cache')
  })

  it('Should generate markdown if MOCKED is false', async () => {
    toJestMock(generateMarkdown).mockResolvedValue('Generated Markdown Content')

    const result = await getMarkdown(
      'any-path.js',
      'codeContent',
      'title',
      false
    )

    expect(result).toBe('Generated Markdown Content')
    expect(generateMarkdown).toHaveBeenCalledWith('codeContent', 'title')
  })
})
