import { render, screen } from "@testing-library/react"
import { ChakraProvider, defaultSystem } from "../src"
import { Highlight } from "../src/components/highlight"

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
)

describe("Highlight", () => {
  describe("string children (backward compatibility)", () => {
    test("renders text with highlighted match for a single string query", () => {
      render(
        <Highlight query="spotlight">
          With the Highlight component, you can spotlight words.
        </Highlight>,
        { wrapper },
      )

      // Matched portion renders inside a <mark> element
      const mark = screen.getByText("spotlight")
      expect(mark.tagName).toBe("MARK")
    })

    test("renders full text when query does not match anything", () => {
      render(
        <Highlight query="nonexistent">Hello world</Highlight>,
        { wrapper },
      )

      expect(screen.getByText("Hello world")).toBeInTheDocument()
      // No mark elements should be rendered
      expect(screen.queryByRole("mark")).not.toBeInTheDocument()
    })

    test("renders full text when query is an empty string", () => {
      render(
        <Highlight query="">Hello world</Highlight>,
        { wrapper },
      )

      expect(screen.getByText("Hello world")).toBeInTheDocument()
      expect(screen.queryByRole("mark")).not.toBeInTheDocument()
    })

    test("renders full text when query is an empty array", () => {
      render(
        <Highlight query={[]}>Hello world</Highlight>,
        { wrapper },
      )

      expect(screen.getByText("Hello world")).toBeInTheDocument()
      expect(screen.queryByRole("mark")).not.toBeInTheDocument()
    })
  })

  describe("multiple query", () => {
    test("highlights all terms in a string array query", () => {
      render(
        <Highlight query={["spotlight", "emphasize"]}>
          You can spotlight and emphasize words.
        </Highlight>,
        { wrapper },
      )

      const spotlightMark = screen.getByText("spotlight")
      expect(spotlightMark.tagName).toBe("MARK")

      const emphasizeMark = screen.getByText("emphasize")
      expect(emphasizeMark.tagName).toBe("MARK")
    })

    test("filters out empty strings in query array", () => {
      render(
        <Highlight query={["", "spotlight"]}>
          You can spotlight words.
        </Highlight>,
        { wrapper },
      )

      const mark = screen.getByText("spotlight")
      expect(mark.tagName).toBe("MARK")
    })

    test("renders full text when array query contains only empty strings", () => {
      render(
        <Highlight query={["", ""]}>Hello world</Highlight>,
        { wrapper },
      )

      expect(screen.getByText("Hello world")).toBeInTheDocument()
      expect(screen.queryByRole("mark")).not.toBeInTheDocument()
    })
  })

  describe("function children (render prop)", () => {
    test("passes highlight chunks to the render function with no text source", () => {
      const renderFn = vi.fn((chunks) => (
        <div data-testid="custom">{chunks.length} chunks</div>
      ))

      render(
        <Highlight query="spotlight">
          {renderFn}
        </Highlight>,
        { wrapper },
      )

      expect(renderFn).toHaveBeenCalledTimes(1)
      const chunks = renderFn.mock.calls[0][0]
      expect(Array.isArray(chunks)).toBe(true)
      // With no source text, useHighlight produces an empty chunk array.
      // The caller decides what to render.
      expect(screen.getByTestId("custom")).toHaveTextContent("0 chunks")
    })

    test("works with multiple query terms", () => {
      const renderFn = vi.fn((chunks) =>
        chunks.map((chunk, i) => (
          <span key={i} data-highlighted={chunk.match || undefined}>
            {chunk.text}
          </span>
        )),
      )

      render(
        <Highlight query={["foo", "bar"]}>
          {renderFn}
        </Highlight>,
        { wrapper },
      )

      expect(renderFn).toHaveBeenCalledTimes(1)
      const chunks = renderFn.mock.calls[0][0]
      expect(Array.isArray(chunks)).toBe(true)
    })

    test("does not throw when render function is used with empty query", () => {
      const renderFn = vi.fn(() => <div>fallback</div>)

      expect(() => {
        render(
          <Highlight query="">{renderFn}</Highlight>,
          { wrapper },
        )
      }).not.toThrow()

      expect(renderFn).toHaveBeenCalledTimes(1)
    })
  })

  describe("error handling", () => {
    test("throws a descriptive error when children is a number", () => {
      expect(() => {
        render(
          <Highlight query="test">{42 as unknown as string}</Highlight>,
          { wrapper },
        )
      }).toThrow(
        /children must be a string or a render function/,
      )
    })

    test("throws a descriptive error when children is null", () => {
      expect(() => {
        render(
          <Highlight query="test">{null as unknown as string}</Highlight>,
          { wrapper },
        )
      }).toThrow(
        /children must be a string or a render function/,
      )
    })

    test("throws a descriptive error when children is an object", () => {
      expect(() => {
        render(
          <Highlight query="test">
            {{ foo: "bar" } as unknown as string}
          </Highlight>,
          { wrapper },
        )
      }).toThrow(
        /children must be a string or a render function/,
      )
    })

    test("does not throw when children is a string", () => {
      expect(() => {
        render(<Highlight query="test">some text</Highlight>, { wrapper })
      }).not.toThrow()
    })

    test("does not throw when children is a function", () => {
      expect(() => {
        render(
          <Highlight query="test">{() => <span>custom</span>}</Highlight>,
          { wrapper },
        )
      }).not.toThrow()
    })
  })
})
