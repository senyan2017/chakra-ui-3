import { type TokenInterface, defaultSystem } from "@chakra-ui/react"

const { tokens } = defaultSystem

export interface GetCategoryTokensOptions {
  filter?: (token: TokenInterface) => boolean
  sort?: (a: TokenInterface, b: TokenInterface) => number
}

/**
 * Retrieve tokens from a given category in the default design system,
 * with optional filtering and sorting.
 */
export function getCategoryTokens(
  category: string,
  options?: GetCategoryTokensOptions,
): TokenInterface[] {
  const categoryTokens = tokens.categoryMap.get(category)?.values()
  if (!categoryTokens) return []

  let result = Array.from(categoryTokens)

  if (options?.filter) {
    result = result.filter(options.filter)
  }

  if (options?.sort) {
    result = result.sort(options.sort)
  }

  return result
}
