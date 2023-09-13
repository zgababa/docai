import fs from 'fs'
import path from 'path'

export function getOutputFilePath(
  inputFilePath: string,
  originalDir: string,
  outputDir: string
): string {
  const fileWithDir = inputFilePath.split(originalDir)[1]
  const fileWithMdExt = fileWithDir.replace(path.extname(fileWithDir), '.md')

  const outputFilePath = path.join(outputDir, fileWithMdExt)

  if (!fs.existsSync(path.dirname(inputFilePath))) {
    fs.mkdirSync(path.dirname(inputFilePath), { recursive: true })
  }

  return outputFilePath
}
