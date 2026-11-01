import { data, type LoaderFunctionArgs } from "react-router";
import { getScenarioById } from "@/entities/scenario";

export async function scenarioDetailLoader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const cleanId = Number(id);
  if (!Number.isInteger(cleanId) || String(cleanId) !== id)
    throw data(`Scenario "${id}" introuvable`, { status: 404 });
  const scenario = await getScenarioById(cleanId);
  if (!scenario) throw data(`Scenario "${id}" introuvable`, { status: 404 });
  return scenario;
}
