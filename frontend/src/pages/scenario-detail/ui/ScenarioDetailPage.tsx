import { useLoaderData } from "react-router";
import type { scenarioDetailLoader } from "../api/loader";
import { ScenarioDetail } from "@/entities/scenario";

export function ScenarioDetailPage() {
  const scenario = useLoaderData<typeof scenarioDetailLoader>();
  return <ScenarioDetail data={scenario} />;
}
