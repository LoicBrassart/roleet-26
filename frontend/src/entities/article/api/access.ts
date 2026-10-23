import { articles } from "../../../shared/mock.json";
import type { Article } from "../model/types";

export async function getAll(): Promise<Article[]> {
  return articles;
}

export async function getById(id: number): Promise<Article | undefined> {
  return articles.find((candidate) => candidate.id === id);
}
