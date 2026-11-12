import type { Article } from "../model/types";
import styles from "./ArticleCard.module.css";

type Props = {
  data: Article;
};
export function ArticleCard({ data }: Props) {
  return <h2 className={styles.ArticleCard}>{data.title}</h2>;
}
