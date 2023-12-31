import {
  COMMENTED_DIR_PATH,
  descriptions as descriptionsMocked
} from '../../_mock/mock-config.js'
import { createTempDirectory } from '../utils/file.js'
import type { Config } from '../types/internal.js'

export function getPathAndDescription({ isMocked, tmpFolderPath }: Config): {
  tmpPath: string
  descriptions: Record<string, string>
} {
  if (isMocked) {
    return {
      tmpPath: tmpFolderPath || COMMENTED_DIR_PATH,
      descriptions: descriptionsMocked
    }
  }

  return {
    tmpPath: tmpFolderPath || createTempDirectory(),
    descriptions: isMocked ? descriptionsMocked : {}
  }
}
