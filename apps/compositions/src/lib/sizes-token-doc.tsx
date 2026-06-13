"use client"

import { Box, For, Stack } from "@chakra-ui/react"
import { TokenDoc } from "./token-doc"
import { TokenTable, type TokenTableColumn } from "./token-table"
import { getCategoryTokens } from "./token-helpers"

const allSizes = getCategoryTokens("sizes")

const fractionalSizes = allSizes.filter((token) => token.name.includes("/"))
const namedSizes = allSizes.filter((token) =>
  token.name.match(/v(h|w)|min|max|fit|prose|full/),
)
const breakpointSizes = allSizes.filter((token) =>
  token.name.match(/breakpoint/),
)
const largeSizes = allSizes.filter(
  (token) =>
    token.name.match(/sm|xl|xs|lg|md/) && !breakpointSizes.includes(token),
)

const tokenSizes = allSizes
  .filter(
    (token) =>
      !fractionalSizes.includes(token) &&
      !namedSizes.includes(token) &&
      !breakpointSizes.includes(token) &&
      !largeSizes.includes(token),
  )
  .sort(
    (a, b) =>
      parseInt(a.extensions.pixelValue!) - parseInt(b.extensions.pixelValue!),
  )

const baseColumns: TokenTableColumn[] = [
  {
    label: "Name",
    width: "160px",
    getValue: (token) => token.extensions.prop,
  },
  {
    label: "Value",
    width: "100px",
    getValue: (token) => token.value,
  },
]

const pixelColumn: TokenTableColumn = {
  label: "Pixel",
  width: "100px",
  getValue: (token) => token.extensions.pixelValue,
}

const groups = [
  { name: "tokenSizes", tokens: tokenSizes, withPixel: true },
  { name: "namedSizes", tokens: namedSizes, withPixel: false },
  { name: "fractionalSizes", tokens: fractionalSizes, withPixel: false },
  { name: "breakpointSizes", tokens: breakpointSizes, withPixel: false },
  { name: "largeSizes", tokens: largeSizes, withPixel: false },
]

export const SizesTokenDoc = () => {
  return (
    <Stack mt="8" gap="8">
      <For each={groups}>
        {(group) => (
          <TokenDoc title={group.name}>
            <TokenTable
              columns={
                group.withPixel
                  ? [...baseColumns, pixelColumn]
                  : baseColumns
              }
              tokens={group.tokens}
              renderPreview={
                group.withPixel
                  ? (token) => (
                      <Box
                        bg="pink.200"
                        height="4"
                        width={`min(${token.originalValue}, 60%)`}
                      />
                    )
                  : undefined
              }
            />
          </TokenDoc>
        )}
      </For>
    </Stack>
  )
}
