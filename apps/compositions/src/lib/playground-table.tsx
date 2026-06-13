"use client"

import { chakra, type HTMLChakraProps } from "@chakra-ui/react"

/**
 * The core styled `<table>` primitive used across composition examples.
 * Renders a native HTML `<table>` with base styles for cell padding
 * and muted header text.
 *
 * Old usage (unchanged):
 * ```tsx
 * <PlaygroundTable>
 *   <thead>...</thead>
 *   <tbody>...</tbody>
 * </PlaygroundTable>
 * ```
 *
 * Enhanced usage with wrapper, title & description:
 * ```tsx
 * <PlaygroundTable.Root title="Badge Sizes" description="All size × color combinations">
 *   <PlaygroundTable>
 *     <thead>...</thead>
 *     <tbody>...</tbody>
 *   </PlaygroundTable>
 * </PlaygroundTable.Root>
 * ```
 */
const PlaygroundTableBase = chakra("table", {
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

/**
 * Convenience label for row-header cells.
 * Replaces the repetitive `<Span fontSize="sm" color="fg.muted" minW="8ch">`
 * pattern found across every size/variant matrix table.
 *
 * ```tsx
 * <td><PlaygroundTable.Label>{colorName}</PlaygroundTable.Label></td>
 * ```
 */
const PlaygroundTableLabel = chakra("span", {
  base: {
    fontSize: "sm",
    color: "fg.muted",
    minW: "8ch",
    display: "inline-block",
  },
})

/**
 * Wrapper that provides optional title and/or description above
 * the playground table. Use this instead of manually wrapping
 * `PlaygroundTable` with a `<div>` + heading in each example file.
 *
 * ```tsx
 * <PlaygroundTable.Root title="Badge Sizes">
 *   <PlaygroundTable>...</PlaygroundTable>
 * </PlaygroundTable.Root>
 * ```
 */
const PlaygroundTableRoot = chakra("div", {
  base: {
    marginBottom: "8",
    "& table": {
      marginBottom: "0",
    },
  },
})

export interface PlaygroundTableRootProps
  extends HTMLChakraProps<"div"> {
  /** Optional title displayed above the table. */
  title?: React.ReactNode
  /** Optional description displayed below the title. */
  description?: React.ReactNode
}

const PlaygroundTableRootWithMeta = ({
  title,
  description,
  children,
  ...rest
}: PlaygroundTableRootProps) => (
  <PlaygroundTableRoot {...rest}>
    {title && (
      <PlaygroundTableTitle>{title}</PlaygroundTableTitle>
    )}
    {description && (
      <PlaygroundTableDescription>{description}</PlaygroundTableDescription>
    )}
    {children}
  </PlaygroundTableRoot>
)

/**
 * Standalone title component for use inside `PlaygroundTable.Root`.
 */
const PlaygroundTableTitle = chakra("h3", {
  base: {
    fontSize: "md",
    fontWeight: "semibold",
    marginBottom: "1",
  },
})

/**
 * Standalone description component for use inside `PlaygroundTable.Root`.
 */
const PlaygroundTableDescription = chakra("p", {
  base: {
    fontSize: "sm",
    color: "fg.muted",
    marginBottom: "3",
  },
})

// ---- Compound API ----
// Consumers can use PlaygroundTable.Label, PlaygroundTable.Root, etc.
// without extra imports, while the default export remains the <table> itself.

export const PlaygroundTable = Object.assign(PlaygroundTableBase, {
  /** Row-label convenience: `<PlaygroundTable.Label>text</PlaygroundTable.Label>` */
  Label: PlaygroundTableLabel,
  /** Wrapper with optional title/description props */
  Root: PlaygroundTableRootWithMeta,
  /** Standalone title (use inside Root) */
  Title: PlaygroundTableTitle,
  /** Standalone description (use inside Root) */
  Description: PlaygroundTableDescription,
})

// Also export individually for consumers that prefer named imports.
export {
  PlaygroundTableLabel,
  PlaygroundTableRoot,
  PlaygroundTableRootWithMeta,
  PlaygroundTableTitle,
  PlaygroundTableDescription,
}
