import { getFilesFromFolder, deleteFolder, cleanFolder } from '../utils/file.js'

import { writeMarkdownFile } from './write-markdown.js'
import type { Config } from '../types/internal.js'

export async function generateMarkdownFromCommentedCode(
  tmpDirectoryPath: string,
  config: Config
): Promise<void> {
  cleanFolder(config.outputDir)

  const filesToParsed = getFilesFromFolder(tmpDirectoryPath)

  await Promise.all(
    filesToParsed.map(writeMarkdownFile(tmpDirectoryPath, config))
  )

  if (config.deleteTmpFolder) {
    deleteFolder(tmpDirectoryPath)
  }

  console.log('Documentation generated to', config.outputDir)
}
