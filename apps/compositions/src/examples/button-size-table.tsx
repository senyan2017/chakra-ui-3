"use client"

import { Button, For, Span, useRecipe } from "@chakra-ui/react"
import { colorPalettes } from "compositions/lib/color-palettes"
import {
  PlaygroundTable,
  PlaygroundTableContainer,
} from "compositions/lib/playground-table"
import { HiArrowRight } from "react-icons/hi"

export const ButtonSizeTable = () => {
  const recipe = useRecipe({ key: "button" })
  return (
    <PlaygroundTableContainer
      title="Button Sizes"
      description="All button sizes across available color palettes."
    >
      <PlaygroundTable>
        <thead>
          <tr>
            <td />
            <For each={recipe.variantMap.size}>{(v) => <td key={v}>{v}</td>}</For>
          </tr>
        </thead>
        <tbody>
          <For each={colorPalettes}>
            {(c) => (
              <tr key={c}>
                <td>
                  <Span fontSize="sm" color="fg.muted" minW="8ch">
                    {c}
                  </Span>
                </td>
                <For each={recipe.variantMap.size}>
                  {(v) => (
                    <td key={v}>
                      <Button size={v} colorPalette={c}>
                        Next <HiArrowRight />
                      </Button>
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </PlaygroundTable>
    </PlaygroundTableContainer>
  )
}
