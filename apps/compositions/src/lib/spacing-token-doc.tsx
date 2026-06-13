"use client"

import { Box } from "@chakra-ui/react"
import { TokenDoc } from "./token-doc"
import {
  type TokenTableColumn,
  TokenTable,
  getCategoryTokens,
} from "./token-doc-helpers"

export const defaultSpacings = getCategoryTokens("spacing")
  .filter(
    (token) =>
      token.extensions.category === "spacing" && !token.extensions.negative,
  )
  .sort((a, b) => parseFloat(a.value) - parseFloat(b.value))

const columns: TokenTableColumn[] = [
  { label: "Name", width: "100px", render: (t) => t.extensions.prop },
  { label: "Value", width: "100px", render: (t) => t.value },
  {
    label: "Pixel",
    width: "100px",
    render: (t) => t.extensions.pixelValue,
  },
]

export const SpacingTokenDoc = () => {
  return (
    <TokenDoc title="theme.tokens.spacing" mt="8">
      <TokenTable
        tokens={defaultSpacings}
        columns={columns}
        renderExtra={(token) => (
          <Box flex="1">
            <Box
              bg="pink.200"
              height="4"
              width={token.extensions.cssVar!.ref}
            />
          </Box>
        )}
      />
    </TokenDoc>
  )
}
