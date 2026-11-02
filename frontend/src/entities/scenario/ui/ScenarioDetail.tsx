import type { ReactNode } from "react";
import type { Scenario } from "../model/types";

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
      <h2>Synopsis</h2>
      <p>{data.synopsis}</p>
      <h2>Plus en détails</h2>
      <p>{data.content}</p>
    </article>
  );
}
