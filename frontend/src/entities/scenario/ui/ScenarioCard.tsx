import type { Scenario } from "../model/types";
import type { ReactNode } from "react";

type Props = {
  data: Scenario;
  badges: ReactNode;
  sealStatus: ReactNode;
};
export function ScenarioCard({ data, badges, sealStatus }: Props) {
  return (
    <>
      <h2>
        {data.title} {sealStatus}
      </h2>
      <p>{badges}</p>
      <p>{data.teaser}</p>
    </>
  );
}
