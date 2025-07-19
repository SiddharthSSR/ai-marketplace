"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { useTheme } from "next-themes"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { prism } from "react-syntax-highlighter/dist/cjs/styles/prism"

interface MarkdownOutputProps {
  content: string
}

export const MarkdownOutput: React.FC<MarkdownOutputProps> = ({ content }) => {
  const { theme } = useTheme()

  return (
    <div className="prose max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-bold mt-4 mb-2 text-foreground">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-semibold mt-4 mb-2 text-foreground">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-semibold mt-3 mb-1 text-foreground">{children}</h3>,
          p: ({ children }) => <p className="text-foreground mb-3 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-3 text-foreground">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-3 text-foreground">{children}</ol>,
          li: ({ children }) => <li className="mb-1 text-foreground">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} className="text-primary hover:underline dark:text-primary-foreground">
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic text-foreground">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground my-4">
              {children}
            </blockquote>
          ),
          code({ className, children }) {
            const match = /language-(\w+)/.exec(className || "")
            return match ? (
              <SyntaxHighlighter
                style={theme === "dark" ? prism : oneLight}
                language={match[1]}
                PreTag="div"
                className="rounded-md text-sm bg-muted dark:bg-gray-800"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-muted text-red-600 px-1 py-0.5 rounded font-mono text-sm dark:bg-gray-800 dark:text-red-400">
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}