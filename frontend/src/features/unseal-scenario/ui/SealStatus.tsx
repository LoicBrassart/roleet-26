interface Props {
  isUnsealed: boolean;
}
export function SealStatus({ isUnsealed }: Props) {
  return (
    <span role="img" aria-label={isUnsealed ? "Ouvert" : "Scellé"}>
      {isUnsealed ? "🔓" : "🔒"}
    </span>
  );
}
