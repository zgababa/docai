export type FunctionsMapping = Record<string, string>

export type RawConfig = {
  output: string
  mocked?: boolean
  basedir?: string
  entrypoint?: string
  serverless?: string
  temperature?: number
  modelName?: string
  noDeleteTmp?: boolean
  tmpDirPath?: string
}

export type EntryConfigDocai = {
  outputDir: string
  openAi: {
    temperature?: number
    modelName?: string
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
  openAi: {
    temperature?: number
    modelName?: string
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
