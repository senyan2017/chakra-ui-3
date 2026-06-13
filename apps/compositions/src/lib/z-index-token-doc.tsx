"use client"

import { TokenDoc } from "./token-doc"
import {
  type TokenTableColumn,
  TokenTable,
  getCategoryTokens,
} from "./token-doc-helpers"

export const defaultZIndex = getCategoryTokens("zIndex").sort(
  (a, b) => parseFloat(a.originalValue) - parseFloat(b.originalValue),
)

const columns: TokenTableColumn[] = [
  { label: "Name", width: "100px", render: (t) => t.extensions.prop },
  { label: "Value", width: "100px", render: (t) => t.originalValue },
]

export const ZIndexTokenDoc = () => {
  return (
    <TokenDoc title="theme.tokens.zIndex" mt="8">
      <TokenTable tokens={defaultZIndex} columns={columns} />
    </TokenDoc>
  )
}
