import fs from 'fs'
import path from 'path'

import { getMarkdown } from './get-markdown.js'
import { getOutputFilePath } from './get-output-file-path.js'
import { ensureDirExists } from '../utils/file.js'
import type { Config } from '../types/internal.js'

export function writeMarkdownFile(originalDir: string, config: Config) {
  return async (inputFilePath: string) => {
    if (inputFilePath === '') throw new Error('No input file path provided')

    const codeContent = fs.readFileSync(inputFilePath, 'utf-8')
    const title = inputFilePath.split('/').pop()?.split('.')[0]

    if (title === undefined) {
      throw new Error('Error in inputFilePath, title is undefined')
    }

    const markdown = await getMarkdown(
      inputFilePath,
      codeContent,
      title,
      config.isMocked
    )
    const outputFilePath = getOutputFilePath(
      inputFilePath,
      originalDir,
      config.outputDir
    )

    ensureDirExists(path.dirname(outputFilePath))

    fs.writeFileSync(outputFilePath, markdown)
  }
}
