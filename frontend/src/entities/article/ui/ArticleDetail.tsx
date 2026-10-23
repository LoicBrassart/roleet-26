import type { Article } from "../model/types";

type Props = {
  data: Article;
};
export function ArticleDetail({ data }: Props) {
  return (
    <article>
      <h2>{data.title}</h2>
      <sub>By {data.author}</sub>
    </article>
  );
}
