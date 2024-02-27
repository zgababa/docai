import { ChatPromptTemplate } from '@langchain/core/prompts'
import {
  generateMarkdown,
  generateCommentFromCode
} from '../../../src/llm/llm.js'
import { getModel } from '../../../src/llm/model.js'

jest.mock('../../../src/llm/model.js')

describe('llm', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('generateMarkdown', () => {
    it('Should call the llm with correct parameters', async () => {
      const code = 'code'
      const title = 'title'

      const result = await generateMarkdown(code, title)

      expect(ChatPromptTemplate.fromTemplate).toHaveBeenCalledTimes(1)
      expect(ChatPromptTemplate.fromTemplate)
        .toHaveBeenCalledWith(`You have to write a markdown documentation page for this file: {code}
    It should contain only these parts:
    # {title}
    ## Description <!-- Explain what the code does, using the comments you'll find in the code. -->
    ## Code <!-- This section should contains raw code, formatted in Javascript. -->
    ## Use Cases <!-- If you can, give examples to explain what this file does. You can do it by writing a code block which executes functions from the file and display results from their execution in comments. -->`)
      expect(getModel).toHaveBeenCalledTimes(1)
      expect(result).toBe('mocked content')
    })
  })

  describe('generateCommentFromCode', () => {
    it('Should call the llm with the correct parameters', async () => {
      const code = 'code'
      const result = await generateCommentFromCode(code)

      expect(ChatPromptTemplate.fromTemplate).toHaveBeenCalledTimes(1)
      expect(ChatPromptTemplate.fromTemplate).toHaveBeenCalledWith(
        'Explain what this code does as fully as possible: {text}'
      )
      expect(getModel).toHaveBeenCalledTimes(1)
      expect(result).toBe('mocked content')
    })
  })
})
