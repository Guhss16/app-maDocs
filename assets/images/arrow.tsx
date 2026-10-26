import Svg, { G, Path } from "react-native-svg";

type ArrowDirection = "left" | "right" | "up" | "down";

type ArrowProps = {
  width?: number;
  color?: string;
  direction?: ArrowDirection;
  className?: string;
};

export function Arrow({
  width = 13,
  color = "#000000",
  direction = "left",
  className = "",
}: ArrowProps) {
  const directionTransform: Partial<Record<ArrowDirection, string>> = {
    right: "rotate(180 6.5 6.5)",
    up: "rotate(90 6.5 6.5)",
    down: "rotate(-90 6.5 6.5)",
  };

  return (
    <Svg
      width={width}
      height={width}
      viewBox="0 0 13 13"
      fill="none"
      className={className}
    >
      <G transform={directionTransform[direction]}>
        <G transform="translate(13 0) scale(-1 1)">
          <Path
            d="M0.856354 5.44974C0.383405 5.44974 4.88758e-06 5.83314 4.88758e-06 6.30609C4.88758e-06 6.77904 0.383405 7.16244 0.856354 7.16244V6.30609V5.44974ZM0.856354 6.30609V7.16244H11.8564V6.30609V5.44974H0.856354V6.30609ZM12.4619 6.91162C12.7963 6.5772 12.7963 6.03499 12.4619 5.70056L7.01211 0.250791C6.67769 -0.0836349 6.13548 -0.0836349 5.80105 0.250791C5.46663 0.585216 5.46663 1.12743 5.80105 1.46185L10.6453 6.30609L5.80105 11.1503C5.46663 11.4848 5.46663 12.027 5.80105 12.3614C6.13548 12.6958 6.67769 12.6958 7.01211 12.3614L12.4619 6.91162Z"
            fill={color}
          />
        </G>
      </G>
    </Svg>
  );
}
