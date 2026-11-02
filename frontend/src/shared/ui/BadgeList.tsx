import { Badge, type BadgeType } from "./Badge";

interface Props {
  data: {
    id: number;
    label: string;
  }[];
  variant?: BadgeType;
}
export function BadgeList({ data, variant = "tag" }: Props) {
  return data.map((item) => (
    <Badge key={item.id} label={item.label} variant={variant} />
  ));
}
