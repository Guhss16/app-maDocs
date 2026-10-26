import { Arrow } from "@/assets/images/arrow";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

export function BackButton() {
  const router = useRouter();

  return (
    <Pressable
      accessibilityLabel="Voltar para a tela inicial"
      accessibilityRole="button"
      onPress={() => router.replace("/")}
      className="bg-azul-primario rounded-full p-4"
      style={{ alignSelf: "flex-start" }}
    >
      <Arrow color="white" />
    </Pressable>
  );
}
