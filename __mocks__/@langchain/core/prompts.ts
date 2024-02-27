export const invoke = jest.fn().mockResolvedValue({
  lc_kwargs: { content: 'mocked content' }
})

export const pipe = jest.fn(() => ({ invoke }))

export const fromTemplate = jest.fn(() => ({ pipe }))

export const ChatPromptTemplate = jest.fn(() => ({
  fromTemplate
})) as any

ChatPromptTemplate.fromTemplate = fromTemplate
