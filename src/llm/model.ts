import { OpenAI } from 'langchain/llms/openai'

let model: OpenAI | undefined

export function initializeOpenAI({
  modelName = 'gpt-4',
  temperature = 0
}): OpenAI {
  if (!model) {
    model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName,
      temperature
    })
  }
  return model
}

export function getModel(): OpenAI {
  if (!model) {
    throw new Error('Model has not been initialized yet')
  }
  return model
}

export function _resetForTests() {
  model = undefined
}
