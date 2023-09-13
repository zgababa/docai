type FunctionsMapping = Record<string, string>

type ConfigCLI = {
  outputDir: string
  isMocked: boolean
  baseDir: string
  openAi: {
    temperature?: number
    modelName?: string
  }
  entryPoint: string
  serverlessEntryPoint: string
  deleteTmpFolder: boolean
  tmpFolderPath: string
}
