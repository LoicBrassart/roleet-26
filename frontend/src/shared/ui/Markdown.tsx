import ReactMarkdown from "react-markdown";

interface Props {
  content: string;
}
export function Markdown({ content }: Props) {
  return <ReactMarkdown>{content}</ReactMarkdown>;
}
