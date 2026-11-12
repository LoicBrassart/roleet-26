import ReactMarkdown from "react-markdown";
import styles from "./Markdown.module.css";

interface Props {
  content: string;
}
export function Markdown({ content }: Props) {
  return (
    <div className={styles.Markdown}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
