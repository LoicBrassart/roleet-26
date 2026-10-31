import type { LoaderFunctionArgs } from "react-router";
import { getArticleById } from "../../../entities/article";

export async function articleDetailLoader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const cleanId = Number(id);
  if (!Number.isInteger(cleanId) || String(cleanId) !== id)
    throw new Error(`404: article "${id}" not found`);

  const article = await getArticleById(cleanId);
  if (!article) throw new Error(`404: article "${id}" not found`);
  return article;
}
