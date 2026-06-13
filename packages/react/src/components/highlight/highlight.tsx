"use client"

import { type HighlightChunk, useHighlight } from "@ark-ui/react/highlight"
import { Fragment, type JSX } from "react"
import { type SystemStyleObject } from "../../styled-system"
import { For } from "../for"
import { Mark } from "../mark"

export interface HighlightProps {
  /**
   * The query to highlight within the text.
   * Can be a single string or an array of strings.
   */
  query: string | string[]
  /**
   * The text to highlight, or a render function that receives chunks.
   * When using a render function, the `text` prop is required.
   */
  children: string | ((props: HighlightChunk[]) => React.ReactNode)
  /**
   * The text to highlight when using a render function as children.
   * If not provided and children is a function, an empty string is used.
   */
  text?: string | undefined
  /**
   * Custom styles for the highlighted text.
   */
  styles?: SystemStyleObject | undefined
  /**
   * Whether to ignore case when matching.
   */
  ignoreCase?: boolean | undefined
  /**
   * Whether to match all occurrences.
   */
  matchAll?: boolean | undefined
}

/**
 * `Highlight` allows you to highlight substrings of a text.
 *
 * @see Docs https://chakra-ui.com/docs/components/highlight
 */
export function Highlight(props: HighlightProps): JSX.Element {
  const { children, query, text: textProp, ignoreCase, matchAll, styles } = props

  // Determine the text source and render function
  let text: string
  let renderFn: ((chunks: HighlightChunk[]) => React.ReactNode) | undefined

  if (typeof children === "string") {
    // When children is a string, use it as the text source
    text = children
  } else if (typeof children === "function") {
    // When children is a function, use the text prop as the source
    text = textProp ?? ""
    renderFn = children
  } else if (children === undefined || children === null) {
    // Handle empty/undefined children as empty string
    text = textProp ?? ""
  } else {
    throw new Error(
      "Highlight children must be either a string or a function that receives HighlightChunk[]",
    )
  }

  const chunks = useHighlight({
    query,
    text,
    matchAll,
    ignoreCase,
  })

  // If a render function is provided, use it
  if (renderFn) {
    return <>{renderFn(chunks)}</>
  }

  // Default rendering for string children
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
