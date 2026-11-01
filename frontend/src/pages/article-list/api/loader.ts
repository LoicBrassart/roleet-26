import { getAllArticles } from "@/entities/article";

export async function articleListLoader() {
  const articles = await getAllArticles();
  return articles;
}
