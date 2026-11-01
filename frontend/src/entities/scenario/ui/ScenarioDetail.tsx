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
    </article>
  );
}
