import type { Scenario } from "../model/types";
import type { ReactNode } from "react";
import styles from "./ScenarioCard.module.css";

type Props = {
  data: Scenario;
  badges: ReactNode;
  sealStatus: ReactNode;
};
export function ScenarioCard({ data, badges, sealStatus }: Props) {
  return (
    <article className={styles.ScenarioCard}>
      <h2>
        {data.title} {sealStatus}
      </h2>
      <p>{badges}</p>
      <p>{data.teaser}</p>
    </article>
  );
}
