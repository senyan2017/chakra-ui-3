"use client"

import { type HighlightChunk, useHighlight } from "@ark-ui/react/highlight"
import { Fragment, type JSX } from "react"
import { type SystemStyleObject } from "../../styled-system"
import { For } from "../for"
import { Mark } from "../mark"

export interface HighlightProps {
  query: string | string[]
  children: string | ((props: HighlightChunk[]) => React.ReactNode)
  styles?: SystemStyleObject | undefined
  ignoreCase?: boolean | undefined
  matchAll?: boolean | undefined
}

/**
 * `Highlight` allows you to highlight substrings of a text.
 *
 * - Pass a string as `children` to use the default highlight renderer.
 * - Pass a render function `(chunks) => ReactNode` as `children` to take full
 *   control of rendering. The function receives the chunked result of the
 *   highlight operation.
 *
 * @see Docs https://chakra-ui.com/docs/components/highlight
 */
export function Highlight(props: HighlightProps): JSX.Element {
  const { children, query, ignoreCase, matchAll, styles } = props

  if (typeof children !== "string" && typeof children !== "function") {
    throw new Error(
      "[Highlight] children must be a string or a render function (chunks: HighlightChunk[]) => ReactNode",
    )
  }

  // When children is a function there is no source text to highlight — pass an
  // empty string so the hook still produces a valid (empty) chunk array and the
  // caller can decide what to render.
  const text = typeof children === "string" ? children : ""

  // Normalise query into a non-empty-string-safe array.
  // An empty query (or one that collapses to empty after filtering out blank
  // entries) must be handed to useHighlight as `[]` so it returns a single
  // non-matching chunk instead of producing a degenerate regex.
  const queryArr = Array.isArray(query) ? query : [query]
  const normalizedQuery = queryArr.some(Boolean)
    ? queryArr.filter(Boolean)
    : []

  const chunks = useHighlight({
    query: normalizedQuery,
    text,
    matchAll,
    ignoreCase,
  })

  if (typeof children === "function") {
    return <>{children(chunks)}</>
  }

  return (
    <For each={chunks}>
      {(chunk, index) => {
        return chunk.match ? (
          <Mark key={index} css={styles}>
            {chunk.text}
          </Mark>
        ) : (
          <Fragment key={index}>{chunk.text}</Fragment>
        )
      }}
    </For>
  )
}
