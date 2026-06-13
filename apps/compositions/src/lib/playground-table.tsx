"use client"

import { chakra, Stack, Text } from "@chakra-ui/react"

export const PlaygroundTable = chakra("table", {
  base: {
    width: "full",
    marginBottom: "32px",
    borderCollapse: "collapse",
    "& td:not(.chakra-table__cell)": {
      paddingRight: "8",
      paddingBottom: "8",
    },
    "& th:not(.chakra-table__column-header)": {
      fontSize: "sm",
      color: "fg.muted",
    },
    "& thead td:not(.chakra-table__cell)": {
      fontSize: "sm",
      color: "fg.muted",
    },
  },
})

export interface PlaygroundTableContainerProps {
  /** Optional title rendered above the table */
  title?: React.ReactNode
  /** Optional description rendered below the title */
  description?: React.ReactNode
  children: React.ReactNode
}

/**
 * A lightweight wrapper around `PlaygroundTable` that provides an optional
 * title and description, so individual examples don't have to add their own
 * heading JSX every time.
 *
 * Usage:
 * ```tsx
 * <PlaygroundTableContainer title="Button Sizes">
 *   <PlaygroundTable>
 *     ...
 *   </PlaygroundTable>
 * </PlaygroundTableContainer>
 * ```
 */
export const PlaygroundTableContainer = ({
  title,
  description,
  children,
}: PlaygroundTableContainerProps) => {
  const hasHeader = title || description
  if (!hasHeader) return <>{children}</>
  return (
    <Stack gap="2" mb="4">
      <Stack gap="1">
        {title && (
          <Text fontWeight="semibold" fontSize="sm">
            {title}
          </Text>
        )}
        {description && (
          <Text fontSize="xs" color="fg.muted">
            {description}
          </Text>
        )}
      </Stack>
      {children}
    </Stack>
  )
}
