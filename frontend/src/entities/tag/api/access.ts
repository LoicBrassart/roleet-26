import { tags } from "@/shared/mock";
import type { Tag } from "../model/types";

export async function getAllTags(): Promise<Tag[]> {
  return tags;
}

export async function getTagById(id: number): Promise<Tag | undefined> {
  return tags.find((candidate) => candidate.id === id);
}
