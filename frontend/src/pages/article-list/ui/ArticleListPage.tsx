import { useLoaderData } from "react-router";
import { ArticleCard } from "../../../entities/article";
import type { articleListLoader } from "../api/loader";

export function ArticleListPage() {
  const articles = useLoaderData<typeof articleListLoader>();
  return (
    <>
      {articles.map((candidate) => (
        <ArticleCard data={candidate} key={candidate.id} />
      ))}
    </>
  );
}
