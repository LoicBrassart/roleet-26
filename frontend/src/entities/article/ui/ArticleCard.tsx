import type { Article } from "../model/types";

type Props = {
  data: Article;
};
export function ArticleCard({ data }: Props) {
  return <h2>{data.title}</h2>;
}
