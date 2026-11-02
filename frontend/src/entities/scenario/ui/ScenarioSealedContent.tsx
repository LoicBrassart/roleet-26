import type { Scenario } from "../model/types";
import { Markdown } from "@/shared/ui";

interface Props {
  data: Scenario;
}
export function ScenarioSealedContent({ data }: Props) {
  return (
    <>
      <h2>Synopsis</h2>
      <Markdown content={data.synopsis} />
      <h2>Plus en détails</h2>
      <Markdown content={data.content} />
    </>
  );
}
