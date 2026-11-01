import type { Scenario } from "../model/types";

type Props = {
  data: Scenario;
};
export function ScenarioDetail({ data }: Props) {
  return (
    <article>
      <hgroup>
        <h1>{data.title}</h1>
        <p>By {data.author}</p>
      </hgroup>
      <h2>Teaser</h2>
      <p>{data.teaser}</p>
      <h2>Synopsis</h2>
      <p>{data.synopsis}</p>
      <h2>Plus en détails</h2>
      <p>{data.content}</p>
    </article>
  );
}
