export function toJestMock<T>(value: T): jest.Mock {
  return value as any as jest.Mock
}
