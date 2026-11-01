import { useLoaderData } from "react-router";
import type { articleDetailLoader } from "../api/loader";
import { ArticleDetail } from "@/entities/article";

export function ArticleDetailPage() {
  const article = useLoaderData<typeof articleDetailLoader>();
  return <ArticleDetail data={article} />;
}
