import { data, type ActionFunctionArgs } from "react-router";
import { unsealScenario } from "@/features/unseal-scenario";

export async function scenarioDetailAction({ params }: ActionFunctionArgs) {
  const { id } = params;
  const cleanId = Number(id);
  if (!Number.isInteger(cleanId) || String(cleanId) !== id)
    throw data(`Scenario "${id}" introuvable`, { status: 404 });
  await unsealScenario(cleanId);
  return null;
}
