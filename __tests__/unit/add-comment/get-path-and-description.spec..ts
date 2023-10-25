import { getPathAndDescription } from '../../../src/add-comment/get-path-and-description.js'
import type { Config } from '../../../src/types/internal.js'
import { createTempDirectory } from '../../../src/utils/file.js'
import { toJestMock } from '../../../src/utils/mockType.js'

jest.mock('../../../src/utils/file')
jest.mock('../../../_mock/mock-config.js', () => ({
  COMMENTED_DIR_PATH: 'COMMENTED_DIR_PATH',
  descriptions: { 'fake/dir/a.js': 'description' }
}))

describe('getPathAndDescription', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should return mocked path and descriptions when MOCKED is true', () => {
    const result = getPathAndDescription({ isMocked: true } as any as Config)

    expect(createTempDirectory).toHaveBeenCalledTimes(0)
    expect(result).toEqual({
      tmpPath: 'COMMENTED_DIR_PATH',
      descriptions: { 'fake/dir/a.js': 'description' }
    })
  })

  it('Should use tmpFolderPath when MOCKED is true and tmpFolderPath is passed', () => {
    const result = getPathAndDescription({
      isMocked: true,
      tmpFolderPath: 'tmpFolderPath'
    } as any as Config)

    expect(createTempDirectory).toHaveBeenCalledTimes(0)
    expect(result).toEqual({
      tmpPath: 'tmpFolderPath',
      descriptions: { 'fake/dir/a.js': 'description' }
    })
  })

  it('Should call createTempDirectory and return empty descriptions when MOCKED is not true', () => {
    toJestMock(createTempDirectory).mockReturnValue('tempPath')
    const result = getPathAndDescription({
      isMocked: false
    } as any as Config)

    expect(createTempDirectory).toHaveBeenCalledTimes(1)
    expect(result.tmpPath).toBe('tempPath')
    expect(result.descriptions).toEqual({})
  })

  it('Should use tmpFolderPath when is passed and MOCKED is not true', () => {
    const result = getPathAndDescription({
      isMocked: false,
      tmpFolderPath: 'foo'
    } as any as Config)

    expect(createTempDirectory).toHaveBeenCalledTimes(0)
    expect(result.tmpPath).toBe('foo')
    expect(result.descriptions).toEqual({})
  })
})
