export const ChatOllama = jest.fn()
export const call = jest.fn().mockImplementation(async () => {
  return await Promise.resolve('mocked response')
})

ChatOllama.mockImplementation(() => {
  return {
    call
  }
})
