import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders a markdown string with the editorial prose styles. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-editorial">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
