import minimist from 'minimist'
import { docai } from '../index.js'
import type { RawConfig } from '../types/internal.js'
import { PROVIDER_LIST } from '../utils/contants.js'
import type { T_PROVIDER_LIST } from '../utils/contants.js'

function checkRequiredFields(args: RawConfig) {
  if (!args.local) {
    if (!process.env.API_KEY) {
      throw new Error('You have to provide an API_KEY')
    }
    if (!PROVIDER_LIST.includes(args.modelProvider)) {
      throw new Error(
        `Only ${PROVIDER_LIST.join(
          ', '
        )} llm are supported. Please choose one with modelProvider argument`
      )
    }
  }

  if (!args.output) {
    throw new Error('An outpath path is required')
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
  const args = minimist(cliArgs) as any as RawConfig

  checkRequiredFields(args)

  const localOrExternalLLm = args.local
    ? {
        local: {
          modelName: args.modelName,
          baseUrl: args.baseUrl
        }
      }
    : {
        llm: {
          temperature: args.temperature,
          modelName: args.modelName,
          modelProvider: args.modelProvider as T_PROVIDER_LIST,
          apiKey: process.env.API_KEY as string
        }
      }

  await docai({
    outputDir: args.output,
    isMocked: Boolean(args.mocked),
    baseDir: args.basedir ?? '',
    ...localOrExternalLLm,
    files: [],
    entryPoint: args.entrypoint,
    serverlessEntryPoint: args.serverless,
    deleteTmpFolder: !args.noDeleteTmp,
    tmpFolderPath: args.tmpDirPath ?? ''
  })
}
