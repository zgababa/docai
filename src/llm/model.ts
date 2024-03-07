import { ChatMistralAI } from '@langchain/mistralai'
import { ChatOpenAI } from '@langchain/openai'
import { ChatGroq } from '@langchain/groq'
import { PROVIDER_LIST } from '../utils/contants.js'

let model: ChatOpenAI | ChatMistralAI | ChatGroq | undefined

export type MODEL = ChatOpenAI | ChatMistralAI | ChatGroq

export function initializeModel({
  modelProvider,
  modelName,
  temperature = 0,
  apiKey
}): MODEL {
  if (!apiKey) throw new Error('Missing apiKey')

  switch (modelProvider) {
    case 'openAI':
      model = new ChatOpenAI({
        openAIApiKey: apiKey,
        modelName,
        temperature
      })
      break
    case 'mistral':
      model = new ChatMistralAI({
        apiKey,
        modelName,
        temperature
      })
      break
    case 'groq':
      model = new ChatGroq({
        apiKey,
        modelName,
        temperature
      })
      break
    default:
      throw new Error(
        `Only ${PROVIDER_LIST.join(', ')} llm are supported. Please choose one`
      )
  }

  return model
}

export function getModel(): MODEL {
  if (!model) {
    throw new Error('Model has not been initialized yet')
  }
  return model
}

export function _resetForTests() {
  model = undefined
}
