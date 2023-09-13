import { getModel } from '../llm/model.js'

export async function generateMarkdown(
  code: string,
  title: string
): Promise<string> {
  const res = await getModel().call(
    `You have to write a markdown documentation page for this file: ${code}
    It should contain only these parts:
    # ${title}
    ## Description <!-- Explain what the code does, using the comments you'll find in the code. -->
    ## Code <!-- This section should contains raw code, formatted in Javascript. -->
    ## Use Cases <!-- If you can, give examples to explain what this file does. You can do it by writing a code block which executes functions from the file and display results from their execution in comments. -->`
  )

  return res
}

export async function generateCommentFromCode(text: string): Promise<string> {
  const res = await getModel().call(
    `Explain what this code does as fully as possible: ${text}`
  )

  return res
}

export default {
  generateCommentFromCode,
  generateMarkdown
}
