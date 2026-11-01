import { Link, useLoaderData } from "react-router";
import type { scenarioListLoader } from "../api/loader";
import {} from "@/entities/scenario";
import { ScenarioCard } from "@/entities/scenario";

export function ScenarioListPage() {
  const scenarios = useLoaderData<typeof scenarioListLoader>();
  return (
    <>
      <hgroup>
        <h1>Scenarios</h1>
        <p>Scellés par défaut, à toi de choisir lesquels ouvrir!</p>
      </hgroup>
      {scenarios.map((candidate) => (
        <Link to={`/scenario/${candidate.id}`} key={candidate.id}>
          <ScenarioCard data={candidate} />
        </Link>
      ))}
    </>
  );
}
