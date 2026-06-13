"use client"

import { Box, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { TokenDoc } from "./token-doc"
import { getCategoryTokens } from "./token-doc-helpers"

const allEasings = getCategoryTokens("easings")

export const EasingTokenDoc = () => {
  return (
    <TokenDoc title="theme.tokens.easings" mt="8">
      <SimpleGrid columns={2} gap="8" fontSize="sm">
        {allEasings.map((token) => {
          return (
            <Stack key={token.name}>
              <Box
                boxSize="200px"
                bg="pink.200"
                animationName="slide-to-right-full"
                animationTimingFunction={token.value}
                animationDuration="1s"
                animationIterationCount="infinite"
                animationDirection="alternate"
              />
              <Text fontWeight="medium">{token.name}</Text>
            </Stack>
          )
        })}
      </SimpleGrid>
    </TokenDoc>
  )
}
