import Svg, { Path } from "react-native-svg";

type EyeOpenProps = {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

export function EyeOpen({
  width = 24,
  height = 24,
  color = "#000000",
  className = "",
}: EyeOpenProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Path
        d="M21.5999 12.1192C21.5999 12.1192 19.323 18.9756 11.9999 18.8558C4.67683 18.736 2.3999 12.1192 2.3999 12.1192C2.3999 12.1192 4.58452 5.14307 11.9999 5.14307C19.4153 5.14307 21.5999 12.1192 21.5999 12.1192ZM14.3999 12.0294C14.3999 13.3192 13.3254 14.3647 11.9999 14.3647C10.6744 14.3647 9.5999 13.3192 9.5999 12.0294C9.5999 10.7396 10.6744 9.69402 11.9999 9.69402C13.3254 9.69402 14.3999 10.7396 14.3999 12.0294Z"
        strokeWidth={2}
        stroke={color}
      />
    </Svg>
  );
}
