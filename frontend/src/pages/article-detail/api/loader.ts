import { data, type LoaderFunctionArgs } from "react-router";
import { getArticleById } from "../../../entities/article";

export async function articleDetailLoader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const cleanId = Number(id);
  if (!Number.isInteger(cleanId) || String(cleanId) !== id)
    throw data(`Article "${id}" introuvable`, { status: 404 });
  const article = await getArticleById(cleanId);
  if (!article) throw data(`Article "${id}" introuvable`, { status: 404 });
  return article;
}
