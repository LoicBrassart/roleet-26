import { useLoaderData } from "react-router";
import type { scenarioDetailLoader } from "../api/loader";
import { ScenarioDetail, ScenarioSealedContent } from "@/entities/scenario";
import { BadgeList } from "@/shared/ui";
import { UnsealButton } from "@/features/unseal-scenario";

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
      sealedContent={
        scenario.isUnsealed ? (
          <ScenarioSealedContent data={scenario} />
        ) : (
          <UnsealButton />
        )
      }
    />
  );
}
