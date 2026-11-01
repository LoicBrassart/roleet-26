import { articles } from "@/shared/mock.json";
import type { Article } from "../model/types";

export async function getAllArticles(): Promise<Article[]> {
  return articles;
}

export async function getArticleById(id: number): Promise<Article | undefined> {
  return articles.find((candidate) => candidate.id === id);
}
