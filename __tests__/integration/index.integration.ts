import path from 'path'
import fs from 'fs'

import { docai } from '../../src/index'

const mockTestFolder = path.resolve(__dirname, '../../_mock/test')

jest.mock('../../src/utils/file.js', () => ({
  ...jest.requireActual('../../src/utils/file.js'),
  deleteFolder: jest.fn()
}))
jest.mock('../../_mock/mock-config.ts', () => {
  const commented = path.resolve(__dirname, '../../_mock/test/commented/src')
  const generated = path.resolve(__dirname, '../../_mock/test/generated/src')
  const rawFilesParams = path.resolve(__dirname, '../../_mock/test/raw/src')
  return {
    descriptions: {
      [`${commented}/front/under/a.js`]: 'description of a.js',
      [`${commented}/front/outer/b.js`]: 'description of b.js',
      [`${commented}/front/c.js`]: 'description of c.js',
      [`${commented}/front/x.ts`]: 'description of x.ts',
      [`${commented}/back/getUsers.js`]: 'description of getUsers.js',
      [`${commented}/back/createUser.js`]: 'description of createUser.js',
      [`${commented}/back/deleteUser.js`]: 'description of deleteUser.js',
      [`${commented}/back/updateUser.ts`]: 'description of updateUser.ts'
    },
    cache: {
      [`${commented}/back/createUser.js`]: `${generated}/back/createUser.md`,
      [`${commented}/back/deleteUser.js`]: `${generated}/back/deleteUser.md`,
      [`${commented}/back/getUsers.js`]: `${generated}/back/getUsers.md`,
      [`${commented}/front/c.js`]: `${generated}/front/c.md`,
      [`${commented}/front/x.ts`]: `${generated}/front/x.md`,
      [`${commented}/front/outer/b.js`]: `${generated}/front/outer/b.md`,
      [`${commented}/front/under/a.js`]: `${generated}/front/under/a.md`,
      [`${rawFilesParams}/back/createUser.js`]: `${generated}/back/createUser.md`,
      [`${rawFilesParams}/back/deleteUser.js`]: `${generated}/back/deleteUser.md`,
      [`${rawFilesParams}/back/getUsers.js`]: `${generated}/back/getUsers.md`,
      [`${commented}/back/updateUser.ts`]: `${generated}/back/updateUser.md`
    },
    COMMENTED_DIR_PATH: path.resolve(__dirname, '../../_mock/test/commented')
  }
})

describe('Index Integration Mocked', () => {
  beforeEach(() => {
    fs.rmSync(path.resolve(`${mockTestFolder}/commented`), {
      recursive: true,
      force: true
    })
    fs.rmSync(path.resolve(`${mockTestFolder}/markdownUpdated`), {
      recursive: true,
      force: true
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should generate code', async () => {
    await docai({
      entryPoint: path.resolve(`${mockTestFolder}/raw/src/back/getUsers.js`),
      baseDir: path.resolve(`${mockTestFolder}/raw`),
      outputDir: path.resolve(__dirname, '../../_mock/test/markdownUpdated'),
      isMocked: true,
      openAi: {
        apiKey: 'OPENAI_API_KEY'
      }
    })

    const fileContent = fs.readFileSync(
      `${mockTestFolder}/commented/src/front/c.js`,
      'utf8'
    )

    const expectedContent = `
const {
  matrixMultiplication,
  matrixAddition
} = require('./under/a')
/*description of a.js*/
`

    expect(fileContent.replace(/\s+/g, '')).toContain(
      expectedContent.replace(/\s+/g, '')
    )
  })

  it('Should generate markdown', async () => {
    await docai({
      entryPoint: path.resolve(`${mockTestFolder}/raw/src/back/getUsers.js`),
      baseDir: path.resolve(`${mockTestFolder}/raw`),
      outputDir: path.resolve(__dirname, '../../_mock/test/markdownUpdated'),
      isMocked: true,
      openAi: {
        apiKey: 'OPENAI_API_KEY'
      }
    })

    const fileContent = fs.readFileSync(
      path.resolve(`${mockTestFolder}/markdownUpdated/src/front/c.md`),
      'utf8'
    )

    const expectedContent = `# c ## Description
This file contains two distinct parts. The first part is a JavaScript module that exports three functions: \`matrixAddition\`, \`matrixMultiplication\`, and \`matrixTranspose\`. These functions perform operations on matrices. The second part is also a JavaScript module that exports three functions: \`dotProduct\`, \`crossProduct\`, and \`vectorMagnitude\`. These functions perform operations on vectors.`

    expect(fileContent.replace(/\s+/g, '')).toContain(
      expectedContent.replace(/\s+/g, '')
    )
  })

  it('Should generate commented code and markdown with serverless plugin', async () => {
    await docai({
      serverlessEntryPoint: path.resolve(
        `${mockTestFolder}/plugins/serverless.yml`
      ),
      baseDir: path.resolve(`${mockTestFolder}/raw`),
      outputDir: path.resolve(__dirname, '../../_mock/test/markdownUpdated'),
      isMocked: true,
      openAi: {
        apiKey: 'OPENAI_API_KEY'
      }
    })

    const fileContent = fs.readFileSync(
      path.resolve(`${mockTestFolder}/markdownUpdated/src/back/createUser.md`),
      'utf8'
    )

    const expectedContent = `# createUser## Description
\`\`\`javascript
const createUser = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'User created!'
    })
  }
}
module.exports.handler = createUser
\`\`\`
`

    expect(fileContent.replace(/\s+/g, '')).toContain(
      expectedContent.replace(/\s+/g, '')
    )
  })
  it('Should generate only markdown for files contained in files params', async () => {
    await docai({
      files: [
        `${mockTestFolder}/raw/src/back/createUser.js`,
        `${mockTestFolder}/raw/src/back/deleteUser.js`,
        `${mockTestFolder}/raw/src/back/getUsers.js`
      ],
      baseDir: path.resolve(`${mockTestFolder}/raw`),
      outputDir: path.resolve(__dirname, '../../_mock/test/markdownUpdated'),
      isMocked: true,
      openAi: {
        apiKey: 'OPENAI_API_KEY'
      }
    })

    const fileContent = fs.readFileSync(
      path.resolve(`${mockTestFolder}/markdownUpdated/createUser.md`),
      'utf8'
    )

    const expectedContent = `# createUser## Description
\`\`\`javascript
const createUser = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'User created!'
    })
  }
}
module.exports.handler = createUser
\`\`\`
`

    expect(fileContent.replace(/\s+/g, '')).toContain(
      expectedContent.replace(/\s+/g, '')
    )
  })

  it('Should work with typescript files', async () => {
    await docai({
      entryPoint: path.resolve(`${mockTestFolder}/raw/src/back/updateUser.ts`),
      baseDir: path.resolve(`${mockTestFolder}/raw`),
      outputDir: path.resolve(__dirname, '../../_mock/test/markdownUpdated'),
      isMocked: true,
      openAi: {
        apiKey: 'OPENAI_API_KEY'
      }
    })

    const fileContent = fs.readFileSync(
      `${mockTestFolder}/commented/src/front/x.ts`,
      'utf8'
    )

    const expectedContent = `export function computeComplexOperation(matrixA: number[][], matrixB: number[][], vector1: number[], vector2: number[]) {
  console.log('matrixA', matrixA);
  console.log('matrixB', matrixB);
  console.log('vector1', vector1);
  console.log('vector2', vector2);
}
`

    expect(fileContent.replace(/\s+/g, '')).toContain(
      expectedContent.replace(/\s+/g, '')
    )

    const fileMdContent = fs.readFileSync(
      path.resolve(`${mockTestFolder}/markdownUpdated/src/front/x.md`),
      'utf8'
    )

    const expectedMdContent = `# x
## DescriptionTest of computeComplexOperation in Typescript## Code
\`\`\`javascript
export function computeComplexOperation(
  matrixA: number[][],
  matrixB: number[][],
  vector1: number[],
  vector2: number[]
) {
  console.log('matrixA', matrixA)
  console.log('matrixB', matrixB)
  console.log('vector1', vector1)
  console.log('vector2', vector2)
}
\`\`\`
`

    expect(fileMdContent.replace(/\s+/g, '')).toContain(
      expectedMdContent.replace(/\s+/g, '')
    )
  })
})
