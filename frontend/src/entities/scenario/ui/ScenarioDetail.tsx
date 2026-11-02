import type { ReactNode } from "react";
import type { Scenario } from "../model/types";
import { ScenarioSealedContent } from "./ScenarioSealedContent";

type Props = {
  data: Scenario;
  badges: ReactNode;
};
export function ScenarioDetail({ data, badges }: Props) {
  return (
    <article>
      <hgroup>
        <h1>{data.title}</h1>
        <p>By {data.author}</p>
      </hgroup>
      <p>{badges}</p>
      <h2>Teaser</h2>
      <p>{data.teaser}</p>
      <ScenarioSealedContent data={data} />
    </article>
  );
}
