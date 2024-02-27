import {
  initializeModel,
  getModel,
  _resetForTests
} from '../../../src/llm/model.js'
import { ChatMistralAI } from '@langchain/mistralai'
import { ChatOpenAI } from '@langchain/openai'

describe('Model', () => {
  let initModel
  beforeEach(() => {
    initModel = {
      apiKey: 'apiKey',
      modelName: 'gpt-4',
      modelProvider: 'openAI'
    }
    _resetForTests()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should throw error if getModel is called before initialization', () => {
    expect(() => getModel()).toThrow('Model has not been initialized yet')
  })

  it('Should throw error if initializeModel is called without apiKey', () => {
    initModel.apiKey = ''
    expect(() => initializeModel(initModel)).toThrow('Missing apiKey')
  })

  it('Should throw error if the modelProvider is not supported', () => {
    initModel.modelProvider = 'other'
    expect(() => initializeModel(initModel)).toThrow(
      'Only openAI and mistral llm are supported. Please choose one'
    )
  })

  it('Should initialize ChatOpenAI model correctly', () => {
    initModel.apiKey = 'apiKey'
    const modelInstance = initializeModel(initModel)
    expect(ChatOpenAI).toHaveBeenCalledTimes(1)
    expect(modelInstance).toBeDefined()
  })

  it('Should return the initialized model after calling initializeModel', () => {
    initializeModel(initModel)
    const modelInstance = getModel()
    expect(modelInstance).toBeDefined()
    expect(ChatOpenAI).toHaveBeenCalledTimes(1)
  })

  it('Should not re-initialize if initializeModel is called more than once', () => {
    initializeModel(initModel)
    expect(ChatOpenAI).toHaveBeenCalledTimes(1)
  })

  it('Should pass the correct parameters to ChatOpenAI', () => {
    initializeModel(initModel)
    expect(ChatOpenAI).toHaveBeenCalledWith({
      openAIApiKey: 'apiKey',
      modelName: 'gpt-4',
      temperature: 0
    })
  })

  it('Should pass the correct parameters to Mistral', () => {
    initModel.modelProvider = 'mistral'
    initModel.modelName = 'mistral-tiny'
    initModel.temperature = 0.5

    initializeModel(initModel)
    expect(ChatMistralAI).toHaveBeenCalledWith({
      apiKey: 'apiKey',
      modelName: 'mistral-tiny',
      temperature: 0.5
    })
  })
})
