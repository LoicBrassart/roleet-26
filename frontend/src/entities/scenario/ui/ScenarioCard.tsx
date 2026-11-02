import type { Scenario } from "../model/types";
import type { ReactNode } from "react";

type Props = {
  data: Scenario;
  badges: ReactNode;
};
export function ScenarioCard({ data, badges }: Props) {
  return (
    <>
      <h2>{data.title}</h2>
      <p>{badges}</p>
      <p>{data.teaser}</p>
    </>
  );
}
