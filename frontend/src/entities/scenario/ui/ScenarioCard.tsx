import type { Scenario } from "../model/types";

type Props = {
  data: Scenario;
};
export function ScenarioCard({ data }: Props) {
  return <h2>{data.title}</h2>;
}
