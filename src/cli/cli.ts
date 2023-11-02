import minimist from 'minimist'
import { docai } from '../index.js'
import type { RawConfig } from '../types/internal.js'

function checkRequiredFields(args: RawConfig) {
  if (!args.output) {
    throw new Error('An outpath path is required')
  }

  if (!args.entrypoint && !args.serverless) {
    throw new Error(
      'You have to pass an entrypoint or a serverless path or a files array'
    )
  }
}

export async function cli(cliArgs: string[]): Promise<void> {
  console.log('Generating your documentation...')

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing ENV OPENAI_API_KEY')
  }

  const args = minimist(cliArgs) as any as RawConfig

  checkRequiredFields(args)

  await docai({
    outputDir: args.output,
    isMocked: Boolean(args.mocked),
    baseDir: args.basedir ?? '',
    openAi: {
      temperature: args.temperature,
      modelName: args.modelName,
      apiKey: process.env.OPENAI_API_KEY
    },
    files: [],
    entryPoint: args.entrypoint,
    serverlessEntryPoint: args.serverless,
    deleteTmpFolder: !args.noDeleteTmp,
    tmpFolderPath: args.tmpDirPath ?? ''
  })
}
