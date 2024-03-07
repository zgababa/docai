import path from 'path'
import { addCommentsPerFile } from './add-comment/index.js'
import { generateMarkdownFromCommentedCode } from './generate-doc/index.js'
import { getHandlerPaths } from './plugins/serverless/index.js'
import { initializeModel } from './llm/model.js'
import type { Config, EntryConfigDocai } from './types/internal.js'
import { writeMarkdownFile } from './generate-doc/write-markdown.js'
import { PROVIDER_LIST } from './utils/contants.js'

function checkRequiredFields(config: EntryConfigDocai) {
  if (!config.outputDir) {
    throw new Error('An outpath directory is required. Please fill outputDir')
  }

  if (!config.llm?.apiKey) {
    throw new Error('An API KEY is required. Please fill llm.apiKey')
  }

  if (!PROVIDER_LIST.includes(config.llm?.modelProvider)) {
    throw new Error(
      `Only ${PROVIDER_LIST.join(', ')} llm are supported. Please choose one`
    )
  }

  if (!config.llm?.modelName) {
    throw new Error('A modelName is required. Please fill llm.modelName')
  }

  if (
    !config.entryPoint &&
    !config.serverlessEntryPoint &&
    !config.files?.length
  ) {
    throw new Error(
      'You have to pass an entryPoint or a serverlessEntryPoint or an array of files'
    )
  }
}

export async function docai(configArgs: EntryConfigDocai): Promise<void> {
  checkRequiredFields(configArgs)
  initializeModel(configArgs.llm)

  const config: Config = {
    ...configArgs,
    ...{
      isMocked: Boolean(configArgs.isMocked),
      tmpFolderPath: configArgs.tmpFolderPath ?? '',
      deleteTmpFolder: Boolean(configArgs.deleteTmpFolder),
      outputDir: path.resolve(process.cwd(), configArgs.outputDir),
      baseDir: configArgs.baseDir
        ? path.resolve(configArgs.baseDir)
        : process.cwd()
    }
  }

  console.log('Generating your documentation...')

  if (config.files?.length) {
    try {
      await Promise.all(
        config.files
          .map((file) => path.resolve(file))
          .map(async (file) => {
            await writeMarkdownFile(path.dirname(file), config)(file)
          })
      )
      console.log('Documentation generated to', config.outputDir)
      return
    } catch (err: any) {
      console.error('Error into files', err)
      throw new Error(`Error into generation:  ${err}`)
    }
  }

  const handlerPaths = config.entryPoint
    ? [path.resolve(config.entryPoint)]
    : getHandlerPaths(
        path.resolve(config.serverlessEntryPoint as string),
        config.baseDir
      )

  const directoryToCommentedFiles = (
    await Promise.all(
      handlerPaths.map(
        async (entryHandler) => await addCommentsPerFile(entryHandler, config)
      )
    )
  )[0]

  await generateMarkdownFromCommentedCode(directoryToCommentedFiles, config)
}

export default docai
