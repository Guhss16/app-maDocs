import { Pencil } from "@/assets/images/pencil";
import { Text, View } from "react-native";
import { BackButton } from "../back-button";

export type SecondaryControlsProps = {
  label?: string;
  editavel?: boolean;
};

export default function SecondaryControls({
  label,
  editavel = false,
}: SecondaryControlsProps) {
  return (
    <View className="flex flex-row items-center gap-4">
      <BackButton />
      <Text className="flex-1 text-azul-primario text-xl">{label}</Text>
      {editavel && <Pencil />}
    </View>
  );
}
