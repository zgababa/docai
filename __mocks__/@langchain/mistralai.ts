export const ChatMistralAI = jest.fn()
export const call = jest.fn().mockImplementation(async () => {
  return await Promise.resolve('mocked response')
})

ChatMistralAI.mockImplementation(() => {
  return {
    call
  }
})
