export const OpenAI = jest.fn()
export const call = jest.fn().mockImplementation(async () => {
  return await Promise.resolve('mocked response')
})

OpenAI.mockImplementation(() => {
  return {
    call
  }
})
