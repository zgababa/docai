import path from 'path'
import fs from 'fs'

import { cli } from '../../src/cli/cli'

const mockTestFolder = path.resolve(__dirname, '../../_mock/test')

jest.mock('../../src/utils/file.js', () => ({
  ...jest.requireActual('../../src/utils/file.js'),
  deleteFolder: jest.fn()
}))
jest.mock('../../_mock/mock-config.ts', () => {
  const commented = path.resolve(__dirname, '../../_mock/test/commented/src')
  const generated = path.resolve(__dirname, '../../_mock/test/generated/src')
  return {
    descriptions: {
      [`${commented}/front/under/a.js`]: 'description of a.js',
      [`${commented}/front/outer/b.js`]: 'description of b.js',
      [`${commented}/front/c.js`]: 'description of c.js',
      [`${commented}/back/getUsers.js`]: 'description of getUsers.js',
      [`${commented}/back/createUser.js`]: 'description of createUser.js',
      [`${commented}/back/deleteUser.js`]: 'description of deleteUser.js'
    },
    cache: {
      [`${commented}/back/createUser.js`]: `${generated}/back/createUser.md`,
      [`${commented}/back/deleteUser.js`]: `${generated}/back/deleteUser.md`,
      [`${commented}/back/getUsers.js`]: `${generated}/back/getUsers.md`,
      [`${commented}/front/c.js`]: `${generated}/front/c.md`,
      [`${commented}/front/outer/b.js`]: `${generated}/front/outer/b.md`,
      [`${commented}/front/under/a.js`]: `${generated}/front/under/a.md`
    },
    COMMENTED_DIR_PATH: path.resolve(__dirname, '../../_mock/test/commented')
  }
})

describe('CLI Integration Mocked', () => {
  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'OPENAI_API_KEY'
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

  it('Should throw an error when OPENAI_API_KEY is not provided', async () => {
    process.env.OPENAI_API_KEY = ''
    await expect(cli([])).rejects.toThrow('Missing ENV OPENAI_API_KEY')
  })

  it('Should generate code', async () => {
    await cli([
      '--entrypoint',
      path.resolve(`${mockTestFolder}/raw/src/back/getUsers.js`),
      '--basedir',
      path.resolve(`${mockTestFolder}/raw`),
      '--output',
      path.resolve(__dirname, '../../_mock/test/markdownUpdated'),
      '--mocked'
    ])

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
    await cli([
      '--entrypoint',
      path.resolve(`${mockTestFolder}/raw/src/back/getUsers.js`),
      '--basedir',
      path.resolve(`${mockTestFolder}/raw`),
      '--output',
      path.resolve(__dirname, '../../_mock/test/markdownUpdated'),
      '--mocked'
    ])

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
    await cli([
      '--serverless',
      path.resolve(`${mockTestFolder}/plugins/serverless.yml`),
      '--basedir',
      path.resolve(`${mockTestFolder}/raw`),
      '--output',
      path.resolve(__dirname, '../../_mock/test/markdownUpdated'),
      '--mocked'
    ])

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
})
