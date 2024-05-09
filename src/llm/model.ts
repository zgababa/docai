import { ChatMistralAI } from '@langchain/mistralai'
import { ChatOpenAI } from '@langchain/openai'
import { ChatGroq } from '@langchain/groq'
import { ChatOllama } from '@langchain/community/chat_models/ollama'
import type { EntryConfigDocai } from '../types/internal.js'

import { PROVIDER_LIST } from '../utils/contants.js'

let model: ChatOpenAI | ChatMistralAI | ChatGroq | ChatOllama | undefined

export type MODEL = ChatOpenAI | ChatMistralAI | ChatGroq | ChatOllama

export function initializeModel(config: EntryConfigDocai): MODEL {
  return config.llm
    ? initializeExternalModel(config.llm)
    : initializeLocalModel(config.local)
}

export function initializeExternalModel({
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

export function initializeLocalModel({
  modelName,
  baseUrl = 'http://localhost:11434'
}): ChatOllama {
  model = new ChatOllama({
    model: modelName,
    baseUrl
  })
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
