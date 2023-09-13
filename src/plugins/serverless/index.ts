import path from 'path'
import fs from 'fs'
import yaml from 'js-yaml'

type ServerlessFunctions = {
  functions: Record<
    string,
    {
      handler: string
    }
  >
}

export function getHandlerPaths(
  serverlessYmlPath: string,
  basePath: string = ''
): string[] {
  const serverlessConf = yaml.load(
    fs.readFileSync(serverlessYmlPath, 'utf8')
  ) as ServerlessFunctions

  const handlerPaths: string[] = []

  for (const functionName in serverlessConf.functions) {
    const handler = serverlessConf.functions[functionName].handler
    const removedHandler = handler.split('.handler')[0]

    const jsHandlerPath = path.resolve(basePath, removedHandler + '.js')
    const tsHandlerPath = path.resolve(basePath, removedHandler + '.ts')

    if (fs.existsSync(jsHandlerPath)) {
      handlerPaths.push(jsHandlerPath)
    } else if (fs.existsSync(tsHandlerPath)) {
      handlerPaths.push(tsHandlerPath)
    } else {
      throw new Error(`Handler not found: ${handler}`)
    }
  }

  return handlerPaths
}
