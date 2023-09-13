import fs from 'fs'
import { getHandlerPaths } from '../../../src/plugins/serverless/index.js'
import { toJestMock } from '../../../src/utils/mockType.js'

jest.mock('fs')

describe('getHandlerPaths', () => {
  const serverlessYml = `service: my-service

provider:
  name: aws
  runtime: nodejs12.x
  stage: dev
  region: us-east-1

functions:
  getUsers:
    handler: api/getUsers.handler
    events:
      - http:
          path: users
          method: get
          cors: true
  createUser:
    handler: api/createUser.handler
    events:
      - http:
          path: users
          method: post
          cors: true
  deleteUser:
    handler: api/deleteUser.handler
    events:
      - http:
          path: users/{id}
          method: delete
          cors: true
`

  beforeEach(() => {
    toJestMock(fs.readFileSync).mockReturnValue(serverlessYml)
    toJestMock(fs.existsSync).mockReturnValue(true)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should load the serverless file', () => {
    const pathServerless = 'fake/path/serverless.yaml'

    getHandlerPaths(pathServerless, process.cwd())

    expect(fs.readFileSync).toHaveBeenCalledTimes(1)
    expect(fs.readFileSync).toHaveBeenCalledWith(pathServerless, 'utf8')
  })

  it('Should call existsSync to test if a file exists', () => {
    const pathServerless = 'fake/path/serverless.yaml'

    getHandlerPaths(pathServerless, process.cwd())

    expect(fs.existsSync).toHaveBeenCalledTimes(3)
    expect(fs.existsSync).toHaveBeenCalledWith(
      `${process.cwd()}/api/getUsers.js`
    )
    expect(fs.existsSync).toHaveBeenCalledWith(
      `${process.cwd()}/api/createUser.js`
    )
    expect(fs.existsSync).toHaveBeenCalledWith(
      `${process.cwd()}/api/deleteUser.js`
    )
  })

  it('Should call existsSync on ts file when js file do not exists', () => {
    const pathServerless = 'fake/path/serverless.yaml'
    toJestMock(fs.existsSync)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)

    getHandlerPaths(pathServerless, process.cwd())

    expect(fs.existsSync).toHaveBeenCalledTimes(6)
    expect(fs.existsSync).toHaveBeenCalledWith(
      `${process.cwd()}/api/getUsers.ts`
    )
    expect(fs.existsSync).toHaveBeenCalledWith(
      `${process.cwd()}/api/createUser.ts`
    )
    expect(fs.existsSync).toHaveBeenCalledWith(
      `${process.cwd()}/api/deleteUser.ts`
    )
  })

  it('Should throw an error when not files are found', () => {
    toJestMock(fs.existsSync).mockReturnValue(false)

    expect(getHandlerPaths).toThrow('Handler not found: api/getUsers.handler')

    expect(fs.existsSync).toHaveBeenCalledTimes(2)
  })

  it('Should return an array of file path matching handlers', () => {
    const pathServerless = 'fake/path/serverless.yaml'
    toJestMock(fs.existsSync)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)

    const paths = getHandlerPaths(pathServerless, process.cwd())

    expect(paths).toEqual([
      `${process.cwd()}/api/getUsers.ts`,
      `${process.cwd()}/api/createUser.ts`,
      `${process.cwd()}/api/deleteUser.js`
    ])
  })
})
