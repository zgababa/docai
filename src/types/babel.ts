import type traverse from '@babel/traverse'
import type generator from '@babel/generator'

export type TraverseImportType = {
  default?: typeof traverse
} & typeof traverse

export type GeneratorImportType = {
  default?: typeof generator
} & typeof generator
