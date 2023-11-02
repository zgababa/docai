import type { OpenAI } from 'langchain/llms/openai.js'
import {
  generateMarkdown,
  generateCommentFromCode
} from '../../../src/llm/llm.js'
import { initializeOpenAI } from '../../../src/llm/model.js'

describe('llm', () => {
  let model: OpenAI
  beforeEach(() => {
    model = initializeOpenAI({ apiKey: 'OPEN_AI_API_KEY' })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('generateMarkdown', () => {
    it('Should call the OpenAI API with the correct parameters', async () => {
      const code = 'code'
      const title = 'title'

      const result = await generateMarkdown(code, title)
      expect(model.call).toHaveBeenCalledTimes(1)
      expect(model.call)
        .toHaveBeenCalledWith(`You have to write a markdown documentation page for this file: ${code}
    It should contain only these parts:
    # ${title}
    ## Description <!-- Explain what the code does, using the comments you'll find in the code. -->
    ## Code <!-- This section should contains raw code, formatted in Javascript. -->
    ## Use Cases <!-- If you can, give examples to explain what this file does. You can do it by writing a code block which executes functions from the file and display results from their execution in comments. -->`)
      expect(result).toBe('mocked response')
    })
  })

  describe('generateCommentFromCode', () => {
    it('Should call the OpenAI API with the correct parameters', async () => {
      const code = 'code'
      const result = await generateCommentFromCode(code)

      expect(model.call).toHaveBeenCalledTimes(1)
      expect(model.call).toHaveBeenCalledWith(
        `Explain what this code does as fully as possible: ${code}`
      )
      expect(result).toBe('mocked response')
    })
  })
})
