import {
  Flex,
  Stack,
  Text,
  type TokenInterface,
  defaultSystem,
} from "@chakra-ui/react"

const { tokens, _config } = defaultSystem

/**
 * Get all tokens belonging to a given category from the default system.
 * Returns an empty array if the category doesn't exist.
 */
export function getCategoryTokens(category: string): TokenInterface[] {
  const categoryMap = tokens.categoryMap.get(category)
  if (!categoryMap) return []
  return Array.from(categoryMap.values())
}

/**
 * Get the definition keys for a token category from the system config.
 * Useful when you need the user-defined key names (e.g. radii key names)
 * rather than the fully resolved tokens.
 */
export function getTokenConfigKeys(category: string): string[] {
  const tokenDefs = _config.theme?.tokens as
    | Record<string, Record<string, unknown>>
    | undefined
  return Object.keys(tokenDefs?.[category] ?? {})
}

/* -----------------------------------------------------------------------------
 * TokenTable — lightweight table for rendering token name/value rows
 * -----------------------------------------------------------------------------*/

export interface TokenTableColumn {
  /** Column header label */
  label: string
  /** Column width (CSS value, defaults to "100px") */
  width?: string
  /** Whether the first column should render with medium font weight */
  primary?: boolean
  /** Render the cell content for a given token */
  render: (token: TokenInterface) => React.ReactNode
}

export interface TokenTableProps {
  tokens: TokenInterface[]
  columns: TokenTableColumn[]
  /** Optional extra content rendered at the end of each row (e.g. visual preview) */
  renderExtra?: (token: TokenInterface) => React.ReactNode
}

export const TokenTable = (props: TokenTableProps) => {
  const { tokens, columns, renderExtra } = props
  return (
    <>
      <Flex
        fontSize="sm"
        fontWeight="medium"
        py="1"
        px="3"
        borderBottomWidth="1px"
      >
        {columns.map((col) => (
          <Text key={col.label} width={col.width ?? "100px"}>
            {col.label}
          </Text>
        ))}
      </Flex>

      <Stack px="3" pt="2">
        {tokens.map((token) => (
          <Flex key={token.name} py="1" fontSize="sm">
            {columns.map((col, i) => (
              <Text
                key={col.label}
                width={col.width ?? "100px"}
                fontWeight={i === 0 && col.primary !== false ? "medium" : undefined}
                color={i > 0 ? "fg.muted" : undefined}
              >
                {col.render(token)}
              </Text>
            ))}
            {renderExtra?.(token)}
          </Flex>
        ))}
      </Stack>
    </>
  )
}
