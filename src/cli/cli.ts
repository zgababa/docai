import minimist from 'minimist'
import { docai } from '../index.js'
import type { RawConfig } from '../types/internal.js'

function checkRequiredFields(args: RawConfig) {
  if (!args.output) {
    throw new Error('An outpath path is required')
  }

  if (!['openAI', 'mistral'].includes(args.modelProvider)) {
    throw new Error(
      'Only openAI and mistral llm are supported. Please choose one with modelProvider argument'
    )
  }

  if (!args.modelName) {
    throw new Error('A modelName is required. Please fill modelName argument')
  }

  if (!args.entrypoint && !args.serverless) {
    throw new Error(
      'You have to pass an entrypoint or a serverless path or a files array'
    )
  }
}

export async function cli(cliArgs: string[]): Promise<void> {
  if (!process.env.API_KEY) {
    throw new Error('You have to provide an API_KEY')
  }

  const args = minimist(cliArgs) as any as RawConfig

  checkRequiredFields(args)

  await docai({
    outputDir: args.output,
    isMocked: Boolean(args.mocked),
    baseDir: args.basedir ?? '',
    llm: {
      temperature: args.temperature,
      modelName: args.modelName,
      modelProvider: args.modelProvider as 'openAI' | 'mistral',
      apiKey: process.env.API_KEY
    },
    files: [],
    entryPoint: args.entrypoint,
    serverlessEntryPoint: args.serverless,
    deleteTmpFolder: !args.noDeleteTmp,
    tmpFolderPath: args.tmpDirPath ?? ''
  })
}
