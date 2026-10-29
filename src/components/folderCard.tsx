import type { Folder } from "@/data/folder";
import { router } from "expo-router";
import { Pressable, Text } from "react-native";

type Props = {
  folder: Folder;
};

export default function FolderCard({ folder }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${folder.name}, ${folder.documentCount} ${
        folder.documentCount === 1 ? "documento" : "documentos"
      }`}
      onPress={() =>
        router.push({ pathname: "/folder/[id]", params: { id: folder.id } })
      }
      className="rounded-xl bg-[#D9D9D940] px-4 py-4 shadow-sm"
    >
      <Text className="text-base font-semibold text-azul-primario">
        {folder.name}
      </Text>
      <Text className="mt-1 text-sm text-gray-600">
        {folder.documentCount}{" "}
        {folder.documentCount === 1 ? "Documento" : "Documentos"}
      </Text>
    </Pressable>
  );
}
