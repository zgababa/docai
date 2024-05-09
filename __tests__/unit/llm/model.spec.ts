import { ChatMistralAI } from '@langchain/mistralai'
import { ChatOpenAI } from '@langchain/openai'
import { ChatGroq } from '@langchain/groq'
import { ChatOllama } from '@langchain/community/chat_models/ollama'

import {
  initializeExternalModel,
  getModel,
  _resetForTests,
  initializeLocalModel,
  initializeModel
} from '../../../src/llm/model.js'
import { PROVIDER_LIST } from '../../../src/utils/contants.js'

describe('Model', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('initializeExternalModel', () => {
    let externalModel

    beforeEach(() => {
      externalModel = {
        apiKey: 'apiKey',
        modelName: 'gpt-4',
        modelProvider: 'openAI'
      }
      _resetForTests()
    })

    it('Should throw error if getModel is called before initialization', () => {
      expect(() => getModel()).toThrow('Model has not been initialized yet')
    })

    it('Should throw error if initializeExternalModel is called without apiKey', () => {
      externalModel.apiKey = ''
      expect(() => initializeExternalModel(externalModel)).toThrow(
        'Missing apiKey'
      )
    })

    it('Should throw error if the modelProvider is not supported', () => {
      externalModel.modelProvider = 'other'
      expect(() => initializeExternalModel(externalModel)).toThrow(
        `Only ${PROVIDER_LIST.join(', ')} llm are supported. Please choose one`
      )
    })

    describe('OpenAi', () => {
      it('Should initialize ChatOpenAI model correctly', () => {
        externalModel.apiKey = 'apiKey'
        const modelInstance = initializeExternalModel(externalModel)
        expect(ChatOpenAI).toHaveBeenCalledTimes(1)
        expect(modelInstance).toBeDefined()
      })

      it('Should return the initialized model after calling initializeExternalModel', () => {
        initializeExternalModel(externalModel)
        const modelInstance = getModel()
        expect(modelInstance).toBeDefined()
        expect(ChatOpenAI).toHaveBeenCalledTimes(1)
      })

      it('Should not re-initialize if initializeExternalModel is called more than once', () => {
        initializeExternalModel(externalModel)
        expect(ChatOpenAI).toHaveBeenCalledTimes(1)
      })

      it('Should pass the correct parameters to ChatOpenAI', () => {
        initializeExternalModel(externalModel)
        expect(ChatOpenAI).toHaveBeenCalledWith({
          openAIApiKey: 'apiKey',
          modelName: 'gpt-4',
          temperature: 0
        })
      })
    })

    describe('Mistral', () => {
      it('Should pass the correct parameters to Mistral', () => {
        externalModel.modelProvider = 'mistral'
        externalModel.modelName = 'mistral-tiny'
        externalModel.temperature = 0.5

        initializeExternalModel(externalModel)
        expect(ChatMistralAI).toHaveBeenCalledWith({
          apiKey: 'apiKey',
          modelName: 'mistral-tiny',
          temperature: 0.5
        })
      })
    })

    describe('Groq', () => {
      it('Should pass the correct parameters to Groq', () => {
        externalModel.modelProvider = 'groq'
        externalModel.modelName = 'mistral-8'
        externalModel.temperature = 0.5

        initializeExternalModel(externalModel)
        expect(ChatGroq).toHaveBeenCalledWith({
          apiKey: 'apiKey',
          modelName: 'mistral-8',
          temperature: 0.5
        })
      })
    })
  })

  describe('initializeLocalModel', () => {
    describe('ChatOllama', () => {
      it('Should pass the correct parameters to Ollama', () => {
        initializeLocalModel({
          modelName: 'llama3',
          baseUrl: 'http://local:1234'
        })
        expect(ChatOllama).toHaveBeenCalledWith({
          model: 'llama3',
          baseUrl: 'http://local:1234'
        })
      })
    })
  })

  describe('initializeModel', () => {
    it('Should call initializeExternalModel when llm property is present', () => {
      initializeModel({
        llm: {
          apiKey: 'bar',
          modelProvider: 'groq',
          modelName: 'whatever'
        }
      } as any)

      expect(ChatGroq).toHaveBeenCalledTimes(1)
    })
    it('Should call initializeLocalModel when local property is present', () => {
      initializeModel({
        local: {
          modelName: 'whatever'
        }
      } as any)

      expect(ChatOllama).toHaveBeenCalledTimes(1)
    })
  })
})
