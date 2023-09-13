import type dependencyTree from 'dependency-tree'

export function orderFilesByDeepestDependencies(
  tree: dependencyTree.Tree
): string[] {
  let order: string[] = []

  if (typeof tree === 'string') {
    return [tree]
  }

  for (const filePath in tree) {
    if (Object.keys(tree[filePath]).length !== 0) {
      order = [...order, ...orderFilesByDeepestDependencies(tree[filePath])]
    }
    order.push(filePath)
  }

  return order
}
