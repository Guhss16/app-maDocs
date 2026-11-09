import { Logo } from "@/assets/images/logo";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

type LoadingScreenProps = {
  onLayout?: () => void;
};

export function LoadingScreen({ onLayout }: LoadingScreenProps) {
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.55,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.96,
            duration: 750,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [opacity, scale]);

  return (
    <View
      accessibilityLabel="Carregando aplicativo"
      className="flex-1 items-center justify-center bg-[#3E5DF9]"
      onLayout={onLayout}
    >
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Logo color="white" width={220} height={46} />
      </Animated.View>
    </View>
  );
}
