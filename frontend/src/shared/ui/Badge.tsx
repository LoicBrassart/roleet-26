export type BadgeType = "tag" | "warning";
import styles from "./Badge.module.css";

interface Props {
  label: string;
  variant?: BadgeType;
}
export function Badge({ label, variant = "tag" }: Props) {
  return (
    <span className={styles.Badge}>
      {variant === "warning" && "⚠️ "}
      {label}
    </span>
  );
}
