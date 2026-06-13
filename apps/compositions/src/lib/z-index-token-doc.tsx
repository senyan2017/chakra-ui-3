"use client"

import { TokenDoc } from "./token-doc"
import { TokenTable, type TokenTableColumn } from "./token-table"
import { getCategoryTokens } from "./token-helpers"

export const defaultZIndex = getCategoryTokens("zIndex", {
  sort: (a, b) => parseFloat(a.originalValue) - parseFloat(b.originalValue),
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
    getValue: (token) => token.originalValue,
  },
]

export const ZIndexTokenDoc = () => {
  return (
    <TokenDoc title="theme.tokens.zIndex" mt="8">
      <TokenTable columns={columns} tokens={defaultZIndex} />
    </TokenDoc>
  )
}
