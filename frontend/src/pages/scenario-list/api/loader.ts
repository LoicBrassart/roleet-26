import { getAllScenarios } from "@/entities/scenario";

export async function scenarioListLoader() {
  const scenarios = await getAllScenarios();
  return scenarios;
}
