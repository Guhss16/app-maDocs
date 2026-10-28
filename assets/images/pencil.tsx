import Svg, { Path } from "react-native-svg";

type PencilProps = {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

export function Pencil({
  width = 24,
  height = 24,
  color = "#3E5DF9",
  className = "",
}: PencilProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Path
        d="M4.79999 15.6L8.99999 19.2M4.19999 15.6L16.0314 3.35545C17.3053 2.08155 19.3707 2.08155 20.6446 3.35545C21.9185 4.62935 21.9185 6.69475 20.6446 7.96865L8.39999 19.8L2.39999 21.6L4.19999 15.6Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
