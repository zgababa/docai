import { getModel } from '../llm/model.js'
import { ChatPromptTemplate } from '@langchain/core/prompts'

export async function generateMarkdown(
  code: string,
  title: string
): Promise<any> {
  const prompt = ChatPromptTemplate.fromTemplate(
    `You have to write a markdown documentation page for this file: {code}
    It should contain only these parts:
    # {title}
    ## Description <!-- Explain what the code does, using the comments you'll find in the code. -->
    ## Code <!-- This section should contains raw code, formatted in Javascript. -->
    ## Use Cases <!-- If you can, give examples to explain what this file does. You can do it by writing a code block which executes functions from the file and display results from their execution in comments. -->`
  )
  const chain = prompt.pipe(getModel())

  const res = await chain.invoke({ code, title })

  return res.lc_kwargs.content
}

export async function generateCommentFromCode(text: string): Promise<any> {
  const prompt = ChatPromptTemplate.fromTemplate(
    'Explain what this code does as fully as possible: {text}'
  )
  const chain = prompt.pipe(getModel())

  const res = await chain.invoke({ text })

  return res.lc_kwargs.content
}

export default {
  generateCommentFromCode,
  generateMarkdown
}
