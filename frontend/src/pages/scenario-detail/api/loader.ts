import { data, type LoaderFunctionArgs } from "react-router";
import { getScenarioById } from "@/entities/scenario";
import { getAllTags } from "@/entities/tag";
import { getAllContentWarnings } from "@/entities/content-warning";
import { getUnsealedScenarioIds } from "@/features/unseal-scenario";

export async function scenarioDetailLoader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const cleanId = Number(id);
  if (!Number.isInteger(cleanId) || String(cleanId) !== id)
    throw data(`Scenario "${id}" introuvable`, { status: 404 });
  const scenario = await getScenarioById(cleanId);
  if (!scenario) throw data(`Scenario "${id}" introuvable`, { status: 404 });

  const tags = await getAllTags();
  const warnings = await getAllContentWarnings();
  const scenTags = tags.filter((currTag) =>
    scenario.tagIds.includes(currTag.id),
  );
  const scenWarns = warnings.filter((currWarn) =>
    scenario.contentWarningIds.includes(currWarn.id),
  );
  const unsealedScenarios = await getUnsealedScenarioIds();
  return {
    ...scenario,
    tags: scenTags,
    contentWarnings: scenWarns,
    isUnsealed: unsealedScenarios.includes(cleanId),
  };
}
