import { Pressable, StyleSheet, Text, View } from "react-native";

export type QuickAccessCardProps = {
  label?: string;
  onPress?: () => void;
  className?: string;
};

export function QuickAccessCard({
  label = "RG",
  onPress,
  className = "",
}: QuickAccessCardProps) {
  return (
    <View style={styles.container}>
      <View pointerEvents="none" style={styles.shadow} />
      <Pressable
        accessibilityRole={onPress ? "button" : undefined}
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          pressed && onPress && styles.pressed,
        ]}
        className={className}
      >
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 173,
    height: 104,
  },
  shadow: {
    position: "absolute",
    left: 4,
    top: 4,
    width: 169,
    height: 100,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  card: {
    width: 169,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#D9D9D9",
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    color: "#000000",
    fontFamily: "Poppins",
    fontSize: 20,
    fontWeight: "300",
    fontStyle: "italic",
  },
});
