import 'dotenv/config'

import path from 'path'
import minimist from 'minimist'
import { addCommentsPerFile } from '../add-comment/index.js'
import { generateMarkdownFromCommentedCode } from '../generate-doc/index.js'
import { getHandlerPaths } from '../plugins/serverless/index.js'
import { initializeOpenAI } from '../llm/model.js'

function checkRequiredFields(args: minimist.ParsedArgs) {
  if (!args.output) {
    throw new Error('An outpath path is required')
  }

  if (!args.entrypoint && !args.serverless) {
    throw new Error('You have to pass an entrypoint or a serverless path')
  }
}

export async function run(rawArguments: string[]): Promise<void> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY in env')
  }
  const args = minimist(rawArguments)

  checkRequiredFields(args)

  const config: ConfigCLI = {
    outputDir: path.resolve(process.cwd(), args.output),
    isMocked: Boolean(args.mocked),
    baseDir: args.basedir ? path.resolve(args.basedir) : process.cwd(),
    openAi: {
      temperature: args.temperature,
      modelName: args.modelName
    },
    entryPoint: args.entrypoint,
    serverlessEntryPoint: args.serverless,
    deleteTmpFolder: !args.noDeleteTmp,
    tmpFolderPath: args.tmpDirPath || ''
  }

  initializeOpenAI(config.openAi)

  const handlerPaths = config.entryPoint
    ? [path.resolve(config.entryPoint)]
    : getHandlerPaths(config.serverlessEntryPoint, config.baseDir)

  const directoryToCommentedFiles = (
    await Promise.all(
      handlerPaths.map(
        async (entryHandler) => await addCommentsPerFile(entryHandler, config)
      )
    )
  )[0]

  await generateMarkdownFromCommentedCode(directoryToCommentedFiles, config)
}
