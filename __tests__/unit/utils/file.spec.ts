import path from 'path'
import fs from 'fs'
import os from 'os'

import {
  getExtensionFile,
  moveFileToDirectory,
  createTempDirectory,
  getFilesFromFolder,
  deleteFolder
} from '../../../src/utils/file.js'

describe('File utils', () => {
  describe('getExtensionFile', () => {
    const filePath = path.join(os.tmpdir(), 'exampleFile')
    const jsFilePath = filePath + '.js'
    const tsFilePath = filePath + '.ts'

    afterEach(() => {
      if (fs.existsSync(jsFilePath)) {
        fs.unlinkSync(jsFilePath)
      }

      if (fs.existsSync(tsFilePath)) {
        fs.unlinkSync(tsFilePath)
      }
    })

    it('should return .js file if it exists', () => {
      fs.writeFileSync(jsFilePath, 'content')

      const extensionFile = getExtensionFile(filePath)

      expect(extensionFile).toBe(jsFilePath)
    })

    it('should return .ts file if .js file does not exist', () => {
      fs.writeFileSync(tsFilePath, 'content')

      const extensionFile = getExtensionFile(filePath)

      expect(extensionFile).toBe(tsFilePath)
    })

    it('should throw error if neither .js nor .ts file exists', () => {
      expect(() => getExtensionFile(filePath)).toThrow(
        `No [JS/TS] file found for : ${filePath}`
      )
    })
  })

  describe('moveFileToDirectory', () => {
    let originalFilePaths: string[]
    let originalDir: string
    let newBaseDir: string

    beforeEach(() => {
      newBaseDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'))
      originalDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'))

      originalFilePaths = [path.join(originalDir, 'file.js')]
      fs.writeFileSync(originalFilePaths[0], 'content')
    })

    afterEach(() => {
      originalFilePaths.forEach((filePath) => {
        fs.rmSync(filePath, { recursive: true, force: true })
      })
      fs.rmSync(newBaseDir, { recursive: true, force: true })
    })

    it('should move the file to the new base directory and return new path', async () => {
      const expectedPath = path.join(newBaseDir, 'file.js')

      const newPaths = await moveFileToDirectory(
        originalFilePaths,
        newBaseDir,
        originalDir
      )

      fs.accessSync(expectedPath)
      expect(newPaths).toEqual([expectedPath])
    })
  })

  describe('createTempDirectory', () => {
    const tmpDirectoryPath = createTempDirectory()

    afterEach(() => {
      fs.rmSync(tmpDirectoryPath, { recursive: true })
    })

    it('should create a directory in the system temp directory', () => {
      const expectedPath = path.join(os.tmpdir(), 'docai')
      const dirExists = fs.existsSync(tmpDirectoryPath)

      expect(tmpDirectoryPath).toBe(expectedPath)
      expect(dirExists).toBe(true)
    })
  })

  describe('getFilesFromFolder', () => {
    let testDirPath: string

    beforeEach(() => {
      testDirPath = path.join(os.tmpdir(), 'testDir')

      fs.mkdirSync(path.join(testDirPath, 'subDir'), { recursive: true })
      fs.writeFileSync(path.join(testDirPath, 'file1.js'), 'content')
      fs.writeFileSync(path.join(testDirPath, 'file2.ts'), 'content')
      fs.writeFileSync(
        path.join(testDirPath, 'subDir', 'file3.json'),
        'content'
      )
    })

    afterEach(() => {
      fs.rmSync(testDirPath, { recursive: true, force: true })
    })

    it('should return all files in a directory and its subdirectories', () => {
      const files = getFilesFromFolder(testDirPath)

      const expectedFiles = [
        path.join(testDirPath, 'file1.js'),
        path.join(testDirPath, 'file2.ts'),
        path.join(testDirPath, 'subDir', 'file3.json')
      ]

      files.sort()
      expectedFiles.sort()

      expect(files).toEqual(expectedFiles)
    })
  })

  describe('deleteFolder', () => {
    let testDirPath: string

    beforeEach(() => {
      testDirPath = path.join(os.tmpdir(), 'testDir')

      fs.mkdirSync(testDirPath, { recursive: true })
      fs.writeFileSync(path.join(testDirPath, 'file1.js'), 'content')
    })

    it('should delete a directory and its contents', () => {
      deleteFolder(testDirPath)

      const dirExists = fs.existsSync(testDirPath)

      expect(dirExists).toBe(false)
    })

    it('should not throw error if the directory does not exist', () => {
      const nonExistentDirPath = path.join(os.tmpdir(), 'nonExistentDir')

      expect(() => {
        deleteFolder(nonExistentDirPath)
      }).not.toThrow()
    })
  })
})
