import { addDescriptionsToImports } from '../../../src/add-comment/add-descriptions.js'

function getDescriptions() {
  return {
    './under/a': 'Description a',
    './under/b': 'Description b',
    './under/d': 'Description d',
    './under/e': 'Description e',
    './under/f': 'Description f',
    './under/h': 'Description h',
    i: 'Should have no description'
  }
}
jest.mock('../../../src/utils/file.js', () => {
  const descriptions = getDescriptions()
  let iterator = Object.keys(descriptions)[Symbol.iterator]()

  const getNextKey = () => {
    const result = iterator.next()
    if (result.done) {
      iterator = Object.keys(descriptions)[Symbol.iterator]()
      return null
    }
    return result.value
  }

  return {
    descriptions,
    getExtensionFile: jest.fn(() => getNextKey()),
    createTempDirectory: jest.fn()
  }
})

describe('add-comment', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('addDescriptionsToImports', () => {
    it('Should parse the file, traverse the AST, and generate code with comments', () => {
      /* Don't work for these cases :
        * const moduleName = './under/c'
        * const c = require(moduleName)
        import('./under/g').then(g => {}) */

      const fileToParse = `
          const a = require("./under/a");

          const { b } = require("./under/b");

          import { d } from './under/d';

          import e from './under/e';

          import { fAlias as f } from './under/f';

          import * as h from './under/h';

          import i from 'i';
          `

      const fileExpected = `const a = require("./under/a") /*Description a*/;
const {
  b
} = require("./under/b") /*Description b*/;
import { d } from './under/d';
/*Description d*/
import e from './under/e';
/*Description e*/
import { fAlias as f } from './under/f';
/*Description f*/
import * as h from './under/h';
/*Description h*/
import i from 'i';`

      const descriptions = getDescriptions()
      const ouput = addDescriptionsToImports(
        fileToParse,
        '', // mocked
        descriptions
      )
      expect(ouput).toEqual(fileExpected)
    })
  })
})
