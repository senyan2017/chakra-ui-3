"use client"

import { Box, Flex, Stack, Text, type TokenInterface } from "@chakra-ui/react"

export interface TokenTableColumn {
  label: string
  width: string
  getValue: (token: TokenInterface) => React.ReactNode
}

export interface TokenTableProps {
  columns: TokenTableColumn[]
  tokens: TokenInterface[]
  renderPreview?: (token: TokenInterface) => React.ReactNode
}

export const TokenTable = (props: TokenTableProps) => {
  const { columns, tokens, renderPreview } = props

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
          <Text key={col.label} width={col.width}>
            {col.label}
          </Text>
        ))}
      </Flex>

      <Stack px="3" pt="2">
        {tokens.map((token) => (
          <Flex key={token.name} py="1" fontSize="sm">
            {columns.map((col) => (
              <Text
                key={col.label}
                width={col.width}
                fontWeight={col === columns[0] ? "medium" : undefined}
                color={col !== columns[0] ? "fg.muted" : undefined}
              >
                {col.getValue(token)}
              </Text>
            ))}
            {renderPreview && (
              <Box flex="1">{renderPreview(token)}</Box>
            )}
          </Flex>
        ))}
      </Stack>
    </>
  )
}
