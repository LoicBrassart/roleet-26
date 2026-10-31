import { useLoaderData } from "react-router";
import { ArticleCard } from "../../../entities/article";
import type { articleListLoader } from "../api/loader";

export function ArticleListPage() {
  const articles = useLoaderData<typeof articleListLoader>();
  return (
    <>
      <hgroup>
        <h1>Articles</h1>
        <p>Comment ce site a été développé ?</p>
      </hgroup>
      {articles.map((candidate) => (
        <ArticleCard data={candidate} key={candidate.id} />
      ))}
    </>
  );
}
