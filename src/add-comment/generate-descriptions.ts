import fs from 'fs'

import llm from '../llm/llm.js'

export function generateDescriptionByFile(
  filePath: string,
  descriptions: Record<string, string>
) {
  return async (): Promise<{
    fileContent: string
    filePath: string
    descriptions: Record<string, string>
  }> => {
    if (filePath === '') {
      throw new Error('No file path is provided')
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    // Si on n'a pas encore sa description, on la génère
    if (descriptions[filePath] === undefined) {
      descriptions[filePath] = await llm.generateCommentFromCode(fileContent)
    }

    return { fileContent, filePath, descriptions }
  }
}
