import { Pencil } from "@/assets/images/pencil";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { BackButton } from "../back-button";

export type SecondaryControlsProps = {
  label?: string;
  editavel?: boolean;
  doc?: {
    id: string;
  };
};

function handleOpenEditDocPage(id: string) {
  router.push({
    pathname: "/document/edit",
    params: { id },
  });
}

export default function SecondaryControls({
  label,
  editavel = false,
  doc,
}: SecondaryControlsProps) {
  return (
    <View className="flex flex-row items-center gap-4">
      <BackButton />
      <Text className="flex-1 text-azul-primario text-xl">{label}</Text>
      {editavel && doc && (
        <Pressable
          onPress={() => handleOpenEditDocPage(doc.id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Editar documento"
        >
          <Pencil />
        </Pressable>
      )}
    </View>
  );
}
