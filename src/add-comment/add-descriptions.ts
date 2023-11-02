import path from 'path'
import { parse } from '@babel/parser'
import _generator from '@babel/generator'
import _traverse from '@babel/traverse'
import { type NodePath } from '@babel/traverse'
import * as babelT from '@babel/types'

import { getExtensionFile } from '../utils/file.js'
import {
  type GeneratorImportType,
  type TraverseImportType
} from '../types/babel.js'

// Made for jest to work, Fixed by babel 8 https://github.com/babel/babel/issues/13855
// _traverse.default work for tsc, _traverse for jest

const traverse = (_traverse as TraverseImportType).default ?? _traverse
const generator = (_generator as GeneratorImportType).default ?? _generator

export function addDescriptionsToImports(
  fileToParse: string,
  filePath: string,
  descriptions: Record<string, string>
): any {
  const ast = parse(fileToParse, {
    sourceType: 'module',
    plugins: ['typescript']
  })

  traverse(ast, {
    // On ajoute le commentaire dans les requires correspondant aux fichiers déjà parsées
    CallExpression(pathTree: NodePath<babelT.CallExpression>) {
      if (
        babelT.isIdentifier(pathTree.node.callee) &&
        pathTree.node.callee.name === 'require' &&
        babelT.isStringLiteral(pathTree.node.arguments[0]) &&
        pathTree.node.arguments[0].value.includes('.')
      ) {
        const requirePath = pathTree.node.arguments[0].value

        const absoluteRequirePath = getExtensionFile(
          path.resolve(path.dirname(filePath), requirePath)
        )

        pathTree.addComment('trailing', descriptions[absoluteRequirePath])
      }
    },
    ImportDeclaration(pathTree: NodePath<babelT.ImportDeclaration>) {
      if (
        babelT.isStringLiteral(pathTree.node.source) &&
        pathTree.node.source.value.includes('.')
      ) {
        const importPath = pathTree.node.source.value
        const absoluteImportPath = getExtensionFile(
          path.resolve(path.dirname(filePath), importPath)
        )

        pathTree.addComment('trailing', descriptions[absoluteImportPath])
      }
    }
  })

  return generator(ast, {}, fileToParse).code
}
