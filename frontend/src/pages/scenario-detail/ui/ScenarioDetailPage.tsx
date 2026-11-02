import { useLoaderData } from "react-router";
import type { scenarioDetailLoader } from "../api/loader";
import { ScenarioDetail } from "@/entities/scenario";
import { BadgeList } from "@/shared/ui";

export function ScenarioDetailPage() {
  const scenario = useLoaderData<typeof scenarioDetailLoader>();
  return (
    <ScenarioDetail
      data={scenario}
      badges={
        <>
          <BadgeList data={scenario.contentWarnings} variant="warning" />
          <BadgeList data={scenario.tags} />
        </>
      }
    />
  );
}
