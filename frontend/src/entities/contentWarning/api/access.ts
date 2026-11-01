import { warnings } from "@/shared/mock";
import type { ContentWarning } from "../model/types";

export async function getAllContentWarnings(): Promise<ContentWarning[]> {
  return warnings;
}

export async function getContentWarningById(
  id: number,
): Promise<ContentWarning | undefined> {
  return warnings.find((candidate) => candidate.id === id);
}
