"use client"

import { Box } from "@chakra-ui/react"
import { TokenDoc } from "./token-doc"
import { TokenTable, type TokenTableColumn } from "./token-table"
import { getCategoryTokens } from "./token-helpers"

export const defaultSpacings = getCategoryTokens("spacing", {
  filter: (token) =>
    token.extensions.category === "spacing" && !token.extensions.negative,
  sort: (a, b) => parseFloat(a.value) - parseFloat(b.value),
})

const columns: TokenTableColumn[] = [
  {
    label: "Name",
    width: "100px",
    getValue: (token) => token.extensions.prop,
  },
  {
    label: "Value",
    width: "100px",
    getValue: (token) => token.value,
  },
  {
    label: "Pixel",
    width: "100px",
    getValue: (token) => token.extensions.pixelValue,
  },
]

export const SpacingTokenDoc = () => {
  return (
    <TokenDoc title="theme.tokens.spacing" mt="8">
      <TokenTable
        columns={columns}
        tokens={defaultSpacings}
        renderPreview={(token) => (
          <Box
            bg="pink.200"
            height="4"
            width={token.extensions.cssVar!.ref}
          />
        )}
      />
    </TokenDoc>
  )
}
