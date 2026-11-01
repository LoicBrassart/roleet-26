import { scenarios } from "@/shared/mock";
import type { Scenario } from "../model/types";

export async function getAllScenarios(): Promise<Scenario[]> {
  return scenarios;
}

export async function getScenarioById(
  id: number,
): Promise<Scenario | undefined> {
  return scenarios.find((candidate) => candidate.id === id);
}
