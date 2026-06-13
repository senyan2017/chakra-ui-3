import "@testing-library/jest-dom/vitest"
import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Highlight } from "../src/components/highlight"
import type { HighlightChunk } from "../src/components/highlight"
import { render } from "./core/render"

describe("Highlight", () => {
  describe("string children (backward compatibility)", () => {
    it("should render highlighted text with string children", () => {
      const { container } = render(
        <Highlight query="world">hello world</Highlight>
      )

      // Should render the full text
      expect(container.textContent).toContain("hello")
      expect(screen.getByText("world")).toBeInTheDocument()

      // The matched text should be in a mark element
      const mark = screen.getByText("world")
      expect(mark.tagName.toLowerCase()).toBe("mark")
    })

    it("should handle single query string", () => {
      render(<Highlight query="test">this is a test string</Highlight>)

      expect(screen.getByText("test")).toBeInTheDocument()
      expect(screen.getByText("test").tagName.toLowerCase()).toBe("mark")
    })

    it("should handle multiple query strings", () => {
      render(
        <Highlight query={["hello", "world"]}>hello beautiful world</Highlight>
      )

      expect(screen.getByText("hello")).toBeInTheDocument()
      expect(screen.getByText("world")).toBeInTheDocument()
      expect(screen.getByText("hello").tagName.toLowerCase()).toBe("mark")
      expect(screen.getByText("world").tagName.toLowerCase()).toBe("mark")
    })

    it("should handle no matches gracefully", () => {
      render(<Highlight query="xyz">hello world</Highlight>)

      // Should render the full text without any marks
      expect(screen.getByText("hello world")).toBeInTheDocument()
      const marks = document.querySelectorAll("mark")
      expect(marks.length).toBe(0)
    })

    it("should handle empty query", () => {
      render(<Highlight query="">hello world</Highlight>)

      expect(screen.getByText("hello world")).toBeInTheDocument()
    })

    it("should handle empty text", () => {
      const { container } = render(<Highlight query="test"></Highlight>)

      // Should render without errors
      expect(container).toBeInTheDocument()
    })

    it("should respect ignoreCase option", () => {
      render(
        <Highlight query="WORLD" ignoreCase>
          hello world
        </Highlight>
      )

      expect(screen.getByText("world")).toBeInTheDocument()
      expect(screen.getByText("world").tagName.toLowerCase()).toBe("mark")
    })

    it("should respect matchAll option", () => {
      render(
        <Highlight query="test" matchAll>
          test test test
        </Highlight>
      )

      const marks = document.querySelectorAll("mark")
      expect(marks.length).toBe(3)
    })
  })

  describe("function children (render prop)", () => {
    it("should pass chunks to render function", () => {
      let receivedChunks: HighlightChunk[] | undefined

      render(
        <Highlight query="world" text="hello world">
          {(chunks) => {
            receivedChunks = chunks
            return (
              <div data-testid="custom-render">
                {chunks.map((chunk, i) => (
                  <span key={i} data-match={chunk.match}>
                    {chunk.text}
                  </span>
                ))}
              </div>
            )
          }}
        </Highlight>
      )

      expect(receivedChunks).toBeDefined()
      expect(receivedChunks!.length).toBeGreaterThan(0)
      expect(screen.getByTestId("custom-render")).toBeInTheDocument()
    })

    it("should allow custom rendering of chunks", () => {
      render(
        <Highlight query="world" text="hello world">
          {(chunks) => (
            <div data-testid="custom">
              {chunks.map((chunk, i) =>
                chunk.match ? (
                  <strong key={i} data-testid="highlighted">
                    {chunk.text}
                  </strong>
                ) : (
                  <span key={i} data-testid="normal">
                    {chunk.text}
                  </span>
                )
              )}
            </div>
          )}
        </Highlight>
      )

      expect(screen.getByTestId("custom")).toBeInTheDocument()
      expect(screen.getByTestId("highlighted")).toHaveTextContent("world")
      // The non-matching text should contain "hello" (may or may not have trailing space)
      expect(screen.getByTestId("normal").textContent).toMatch(/hello\s*/)
    })

    it("should handle multiple queries with function children", () => {
      render(
        <Highlight query={["hello", "world"]} text="hello beautiful world">
          {(chunks) => (
            <div data-testid="custom">
              {chunks.map((chunk, i) => (
                <span key={i} data-match={chunk.match}>
                  {chunk.text}
                </span>
              ))}
            </div>
          )}
        </Highlight>
      )

      const customDiv = screen.getByTestId("custom")
      expect(customDiv).toBeInTheDocument()

      // Should have chunks for "hello", " beautiful ", and "world"
      const spans = customDiv.querySelectorAll("span")
      expect(spans.length).toBe(3)
    })

    it("should handle no matches with function children", () => {
      let receivedChunks: HighlightChunk[] | undefined

      render(
        <Highlight query="xyz" text="hello world">
          {(chunks) => {
            receivedChunks = chunks
            return <div data-testid="custom">no matches</div>
          }}
        </Highlight>
      )

      expect(receivedChunks).toBeDefined()
      // Should have one chunk with the full text and match=false
      expect(receivedChunks!.length).toBe(1)
      expect(receivedChunks![0].text).toBe("hello world")
      expect(receivedChunks![0].match).toBe(false)
    })

    it("should handle empty text with function children", () => {
      let receivedChunks: HighlightChunk[] | undefined

      render(
        <Highlight query="test" text="">
          {(chunks) => {
            receivedChunks = chunks
            return <div data-testid="custom">empty</div>
          }}
        </Highlight>
      )

      expect(receivedChunks).toBeDefined()
      expect(screen.getByTestId("custom")).toBeInTheDocument()
    })

    it("should work without text prop (uses empty string)", () => {
      let receivedChunks: HighlightChunk[] | undefined

      render(
        <Highlight query="test">
          {(chunks) => {
            receivedChunks = chunks
            return <div data-testid="custom">no text</div>
          }}
        </Highlight>
      )

      expect(receivedChunks).toBeDefined()
      expect(screen.getByTestId("custom")).toBeInTheDocument()
    })
  })

  describe("error handling", () => {
    it("should throw error for invalid children type", () => {
      expect(() => {
        render(
          <Highlight query="test">
            {/* @ts-expect-error - Testing invalid children type */}
            {123}
          </Highlight>
        )
      }).toThrow(
        "Highlight children must be either a string or a function that receives HighlightChunk[]"
      )
    })

    it("should handle null children gracefully", () => {
      // null children should be treated as empty string
      const { container } = render(
        <Highlight query="test">
          {/* @ts-expect-error - Testing null children */}
          {null}
        </Highlight>
      )
      expect(container).toBeInTheDocument()
    })

    it("should handle undefined children gracefully", () => {
      // undefined children should be treated as empty string
      const { container } = render(<Highlight query="test"></Highlight>)
      expect(container).toBeInTheDocument()
    })

    it("should throw error for object children", () => {
      expect(() => {
        render(
          <Highlight query="test">
            {/* @ts-expect-error - Testing object children */}
            {{ foo: "bar" }}
          </Highlight>
        )
      }).toThrow(
        "Highlight children must be either a string or a function that receives HighlightChunk[]"
      )
    })
  })

  describe("edge cases", () => {
    it("should handle special regex characters in query", () => {
      render(<Highlight query="test.">hello test. world</Highlight>)

      // Should not throw regex errors
      expect(screen.getByText("test.")).toBeInTheDocument()
    })

    it("should handle query with spaces", () => {
      render(<Highlight query="hello world">hello world foo</Highlight>)

      expect(screen.getByText("hello world")).toBeInTheDocument()
      expect(screen.getByText("hello world").tagName.toLowerCase()).toBe("mark")
    })

    it("should handle unicode characters", () => {
      render(<Highlight query="世界">你好世界</Highlight>)

      expect(screen.getByText("世界")).toBeInTheDocument()
      expect(screen.getByText("世界").tagName.toLowerCase()).toBe("mark")
    })
  })
})
