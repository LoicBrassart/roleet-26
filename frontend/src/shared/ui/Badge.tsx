export type BadgeType = "tag" | "warning";

interface Props {
  label: string;
  variant?: BadgeType;
}
export function Badge({ label, variant = "tag" }: Props) {
  return (
    <span>
      {variant === "warning" && "⚠️ "}
      {label}
    </span>
  );
}
