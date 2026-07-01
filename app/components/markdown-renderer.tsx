import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import { useMemo } from "react";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

/**
 * Preprocess content to convert LaTeX delimiters that OpenAI/LLMs use
 * into the format that remark-math understands.
 *
 * Conversions:
 *  - \[ ... \]  →  $$ ... $$   (display/block math)
 *  - \( ... \)  →  $ ... $     (inline math)
 *  - \begin{...} ... \end{...} without $$ wrapping → wrapped in $$
 */
function preprocessLaTeX(content: string): string {
    if (!content) return content;

    let result = content;

    // 1) Convert \[ ... \] to $$ ... $$ (display math)
    //    Handle both single-line and multi-line blocks
    result = result.replace(
        /\\\[\s*([\s\S]*?)\s*\\\]/g,
        (_, math) => `$$\n${math.trim()}\n$$`
    );

    // 2) Convert \( ... \) to $ ... $ (inline math)
    result = result.replace(
        /\\\(\s*([\s\S]*?)\s*\\\)/g,
        (_, math) => `$${math.trim()}$`
    );

    // 3) Wrap standalone \begin{...}...\end{...} blocks in $$ if not already wrapped
    result = result.replace(
        /(?<!\$\$\s*\n?)(\\begin\{[^}]+\}[\s\S]*?\\end\{[^}]+\})/g,
        (match) => {
            // Check if already inside $$ ... $$
            const idx = result.indexOf(match);
            const before = result.substring(Math.max(0, idx - 10), idx).trim();
            if (before.endsWith("$$")) return match;
            return `$$\n${match}\n$$`;
        }
    );

    return result;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
    const processedContent = useMemo(() => preprocessLaTeX(content), [content]);

    return (
        <div className={`markdown-body ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    // Code blocks with syntax highlighting
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match && !String(children).includes("\n");

                        if (isInline) {
                            return (
                                <code className="inline-code" {...props}>
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <div className="code-block-wrapper">
                                {match && (
                                    <div className="code-block-header">
                                        <span className="code-lang">{match[1]}</span>
                                    </div>
                                )}
                                <pre className="code-block">
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            </div>
                        );
                    },
                    // Links open in new tab
                    a({ children, href, ...props }) {
                        return (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="md-link"
                                {...props}
                            >
                                {children}
                            </a>
                        );
                    },
                    // Tables
                    table({ children, ...props }) {
                        return (
                            <div className="table-wrapper">
                                <table {...props}>{children}</table>
                            </div>
                        );
                    },
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
}
