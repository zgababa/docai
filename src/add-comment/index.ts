import dependencyTree from 'dependency-tree'
import fs from 'fs'
import path from 'path'

import { moveFileToDirectory } from '../utils/file.js'
import { generateDescriptionByFile } from './generate-descriptions.js'
import { addDescriptionsToImports } from './add-descriptions.js'
import { orderFilesByDeepestDependencies } from './order-files.js'
import { getPathAndDescription } from './get-path-and-description.js'

export async function addCommentsPerFile(
  entryPoint: string,
  config: ConfigCLI
): Promise<string> {
  const { tmpPath, descriptions } = getPathAndDescription(config)

  const directory = path.dirname(entryPoint)
  const tree = dependencyTree({
    filename: entryPoint,
    directory
  })

  const reverseTree = await moveFileToDirectory(
    orderFilesByDeepestDependencies(tree),
    tmpPath,
    config.baseDir
  )

  const filesToAddDoc = await Promise.all(
    reverseTree.map(async (filePath) =>
      await generateDescriptionByFile(filePath, descriptions)()
    )
  )

  for (const { fileContent, filePath } of filesToAddDoc) {
    const codeWithComments = addDescriptionsToImports(
      fileContent,
      filePath,
      descriptions
    )

    fs.writeFileSync(filePath, codeWithComments)
  }

  return tmpPath
}
