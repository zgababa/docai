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

  it('Should initialize OpenAI model correctly', () => {
    const modelInstance = initializeOpenAI({})
    expect(OpenAI).toHaveBeenCalledTimes(1)
    expect(modelInstance).toBeDefined()
  })

  it('Should return the initialized model after calling initializeOpenAI', () => {
    initializeOpenAI({})
    const modelInstance = getModel()
    expect(modelInstance).toBeDefined()
    expect(OpenAI).toHaveBeenCalledTimes(1)
  })

  it('Should not re-initialize if initializeOpenAI is called more than once', () => {
    initializeOpenAI({})
    initializeOpenAI({})
    expect(OpenAI).toHaveBeenCalledTimes(1)
  })

  it('Should pass the correct parameters to OpenAI', () => {
    const params = {
      modelName: 'test-model',
      temperature: 5
    }
    initializeOpenAI(params)
    expect(OpenAI).toHaveBeenCalledWith({
      openAIApiKey: process.env.OPENAI_API_KEY,
      ...params
    })
  })
})
