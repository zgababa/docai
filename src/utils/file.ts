import path from 'path'
import fs from 'fs'
import os from 'os'

const fsPromisify = fs.promises

export function getExtensionFile(filePath: string): string {
  if (fs.existsSync(filePath + '.js')) {
    return filePath + '.js'
  } else if (fs.existsSync(filePath + '.ts')) {
    return filePath + '.ts'
  }

  throw Error(`No [JS/TS] file found for : ${filePath}`)
}

export async function moveFileToDirectory(
  originalFilePaths: string[],
  newBaseDir: string,
  basePath: string
): Promise<string[]> {
  return await Promise.all(
    originalFilePaths.map(async (filePath: string) => {
      const pathWithoutBase = filePath.split(basePath)[1]
      const newPathTmp = path.join(newBaseDir, pathWithoutBase)
      const newDirPath = path.dirname(newPathTmp)
      await fsPromisify.mkdir(newDirPath, { recursive: true })
      await fsPromisify.copyFile(filePath, newPathTmp)
      return newPathTmp
    })
  )
}

export function createTempDirectory(): string {
  const tmpDirectoryPath = path.join(os.tmpdir(), 'docai')
  fs.mkdirSync(tmpDirectoryPath, { recursive: true })
  return tmpDirectoryPath
}

export function getFilesFromFolder(folderPath: string): string[] {
  const files: string[] = []

  const processFolder = (folderPath: string) => {
    const items = fs.readdirSync(folderPath)

    items.forEach((item) => {
      const itemPath = path.join(folderPath, item)
      const stats = fs.statSync(itemPath)

      if (stats.isFile()) {
        files.push(itemPath)
      } else if (stats.isDirectory()) {
        processFolder(itemPath)
      }
    })
  }

  processFolder(folderPath)

  return files
}

export function deleteFolder(directoryPath: string) {
  if (fs.existsSync(directoryPath)) {
    fs.rmSync(directoryPath, { recursive: true })
  }
}

export function ensureDirExists(dirname: string) {
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true })
  }
}

export function cleanFolder(dirname: string) {
  deleteFolder(dirname)
  ensureDirExists(dirname)
}
