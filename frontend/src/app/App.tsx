import { useLoaderData } from "react-router";
import { ArticleCard } from "../entities/article";
import type { getAll } from "../entities/article";

function App() {
  const articles = useLoaderData<typeof getAll>();

  return (
    <>
      {articles.map((candidate) => (
        <ArticleCard data={candidate} key={candidate.id} />
      ))}
    </>
  );
}

export default App;
