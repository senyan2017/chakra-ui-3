"use client"

import {
  Center,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { TokenDoc } from "./token-doc"
import { getCategoryTokens } from "./token-doc-helpers"

const allAspectRatios = getCategoryTokens("aspectRatios")

export const AspectRatioTokenDoc = () => {
  return (
    <TokenDoc title="theme.tokens.aspectRatios" mt="8">
      <SimpleGrid minChildWidth="160px" gap="8" fontSize="sm">
        {allAspectRatios.map((token) => {
          return (
            <Stack key={token.name} flex="1">
              <Center
                aspectRatio={token.value}
                width="40"
                bg="bg.subtle"
                color="fg.muted"
                borderWidth="1px"
              >
                <VStack gap="0">
                  <Text>{token.extensions.prop}</Text>
                  <Text color="fg.subtle">{token.value}</Text>
                </VStack>
              </Center>
            </Stack>
          )
        })}
      </SimpleGrid>
    </TokenDoc>
  )
}
