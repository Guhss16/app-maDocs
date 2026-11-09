import Svg, { Path } from "react-native-svg";

type StarProps = {
  size?: number;
  color?: string;
  filled?: boolean;
};

export function Star({
  size = 24,
  color = "#F5B400",
  filled = false,
}: StarProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="m12 2.75 2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.31l-5.7 3 1.09-6.35-4.62-4.5 6.38-.93L12 2.75Z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
