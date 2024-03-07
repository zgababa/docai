export const ChatGroq = jest.fn()
export const call = jest.fn().mockImplementation(async () => {
  return await Promise.resolve('mocked response')
})

ChatGroq.mockImplementation(() => {
  return {
    call
  }
})
