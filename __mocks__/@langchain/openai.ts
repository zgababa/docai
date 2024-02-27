export const ChatOpenAI = jest.fn()
export const call = jest.fn().mockImplementation(async () => {
  return await Promise.resolve('mocked response')
})

ChatOpenAI.mockImplementation(() => {
  return {
    call
  }
})
