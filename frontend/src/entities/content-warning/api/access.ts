import { contentWarnings } from "@/shared/mock";
import type { ContentWarning } from "../model/types";

export async function getAllContentWarnings(): Promise<ContentWarning[]> {
  return contentWarnings;
}

export async function getContentWarningById(
  id: number,
): Promise<ContentWarning | undefined> {
  return contentWarnings.find((candidate) => candidate.id === id);
}
