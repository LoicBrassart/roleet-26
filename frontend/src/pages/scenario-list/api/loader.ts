import { getAllContentWarnings } from "@/entities/content-warning";
import { getAllScenarios } from "@/entities/scenario";
import { getAllTags } from "@/entities/tag";
import { getUnsealedScenarioIds } from "@/features/unseal-scenario";

export async function scenarioListLoader() {
  const scenarios = await getAllScenarios();
  const tags = await getAllTags();
  const warnings = await getAllContentWarnings();
  const unsealedScenarios = await getUnsealedScenarioIds();
  const fullScenarios = scenarios.map((scen) => {
    const scenTags = tags.filter((currTag) => scen.tagIds.includes(currTag.id));
    const scenWarns = warnings.filter((currWarn) =>
      scen.contentWarningIds.includes(currWarn.id),
    );
    return {
      ...scen,
      tags: scenTags,
      contentWarnings: scenWarns,
      isUnsealed: unsealedScenarios.includes(scen.id),
    };
  });
  return fullScenarios;
}
