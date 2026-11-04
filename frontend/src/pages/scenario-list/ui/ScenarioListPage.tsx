import { Link, useLoaderData } from "react-router";
import type { scenarioListLoader } from "../api/loader";
import { ScenarioCard } from "@/entities/scenario";
import { BadgeList } from "@/shared/ui";
import { SealStatus } from "@/features/unseal-scenario";

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
          <ScenarioCard
            data={candidate}
            badges={
              <>
                <BadgeList data={candidate.contentWarnings} variant="warning" />
                <BadgeList data={candidate.tags} />
              </>
            }
            sealStatus={<SealStatus isUnsealed={candidate.isUnsealed} />}
          />
        </Link>
      ))}
    </>
  );
}
