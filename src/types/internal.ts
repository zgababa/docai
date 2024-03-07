import type { T_PROVIDER_LIST } from '../utils/contants'

export type FunctionsMapping = Record<string, string>

export type RawConfig = {
  output: string
  mocked?: boolean
  basedir?: string
  entrypoint?: string
  serverless?: string
  temperature?: number
  modelName: string
  modelProvider: string
  noDeleteTmp?: boolean
  tmpDirPath?: string
}

export type EntryConfigDocai = {
  outputDir: string
  llm: {
    temperature?: number
    modelName:
      | 'gpt-4'
      | 'gpt-3.5'
      | 'mistral-tiny'
      | 'mistral-small'
      | 'mistral-medium'
      | 'mixtral-8x7b-32768'
      | 'llama2-70b-4096'
      | string
    modelProvider: T_PROVIDER_LIST
    apiKey: string
  }
  baseDir?: string
  isMocked?: boolean
  files?: string[]
  entryPoint?: string
  serverlessEntryPoint?: string
  deleteTmpFolder?: boolean
  tmpFolderPath?: string
}

export type Config = {
  outputDir: string
  llm: {
    temperature?: number
    modelName: string
    modelProvider: string
    apiKey: string
  }
  files?: string[]
  entryPoint?: string
  serverlessEntryPoint?: string
  baseDir: string
  isMocked: boolean
  deleteTmpFolder: boolean
  tmpFolderPath: string
}
