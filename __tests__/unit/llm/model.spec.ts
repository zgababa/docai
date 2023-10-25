import {
  initializeOpenAI,
  getModel,
  _resetForTests
} from '../../../src/llm/model.js'
import { OpenAI } from 'langchain/llms/openai'

describe('Model', () => {
  beforeEach(() => {
    _resetForTests()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should throw error if getModel is called before initialization', () => {
    expect(() => getModel()).toThrow('Model has not been initialized yet')
  })

  it('Should throw error if initializeOpenAI is called without apiKey', () => {
    expect(() => initializeOpenAI({ apiKey: '' })).toThrow('Missing apiKey')
  })

  it('Should initialize OpenAI model correctly', () => {
    const modelInstance = initializeOpenAI({ apiKey: 'apiKey' })
    expect(OpenAI).toHaveBeenCalledTimes(1)
    expect(modelInstance).toBeDefined()
  })

  it('Should return the initialized model after calling initializeOpenAI', () => {
    initializeOpenAI({ apiKey: 'apiKey' })
    const modelInstance = getModel()
    expect(modelInstance).toBeDefined()
    expect(OpenAI).toHaveBeenCalledTimes(1)
  })

  it('Should not re-initialize if initializeOpenAI is called more than once', () => {
    initializeOpenAI({ apiKey: 'apiKey' })
    initializeOpenAI({ apiKey: 'apiKey' })
    expect(OpenAI).toHaveBeenCalledTimes(1)
  })

  it('Should pass the correct parameters to OpenAI', () => {
    const params = {
      modelName: 'test-model',
      temperature: 5
    }
    initializeOpenAI({ ...params, apiKey: 'apiKey' })
    expect(OpenAI).toHaveBeenCalledWith({
      openAIApiKey: 'apiKey',
      ...params
    })
  })
})
