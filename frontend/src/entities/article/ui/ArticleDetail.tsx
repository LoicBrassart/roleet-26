import type { Article } from "../model/types";

type Props = {
  data: Article;
};
export function ArticleDetail({ data }: Props) {
  return (
    <article>
      <hgroup>
        <h1>{data.title}</h1>
        <p>By {data.author}</p>
      </hgroup>
      <p>{data.content}</p>
    </article>
  );
}
