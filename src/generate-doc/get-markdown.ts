import fs from 'fs'
import { generateMarkdown } from '../llm/llm.js'
import { cache as cacheMocked } from '../../_mock/mock-config.js'

export async function getMarkdown(
  inputFilePath: string,
  codeContent: string,
  title: string,
  isMocked: boolean
): Promise<string> {
  if (isMocked) {
    if (!cacheMocked[inputFilePath]) {
      throw new Error(`Error in cache for ${inputFilePath}`)
    }
    return fs.readFileSync(cacheMocked[inputFilePath], 'utf-8')
  }

  return await generateMarkdown(codeContent, title)
}
