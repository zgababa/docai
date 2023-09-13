import fs from 'fs'
import { ensureDirExists } from '../../../src/utils/file.js'
import { toJestMock } from '../../../src/utils/mockType.js'

jest.mock('fs')

describe('ensureDirExists', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should not call mkdirSync if directory already exists', () => {
    toJestMock(fs.existsSync).mockReturnValue(true)

    ensureDirExists('some/directory/path')

    expect(fs.mkdirSync).not.toHaveBeenCalled()
  })

  it('Should call mkdirSync with correct arguments if directory does not exist', () => {
    toJestMock(fs.existsSync).mockReturnValue(false)

    ensureDirExists('some/directory/path')

    expect(fs.mkdirSync).toHaveBeenCalledWith('some/directory/path', {
      recursive: true
    })
  })
})
