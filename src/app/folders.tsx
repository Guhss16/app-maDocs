import SecondaryView from "@/components/layout/secondary-view";
import FolderCard from "@/components/folderCard";
import { listFolders, type Folder } from "@/data/folder";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, Text } from "react-native";

export default function Folders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setLoadError(false);

      listFolders()
        .then((result) => {
          if (active) setFolders(result);
        })
        .catch((error) => {
          console.error("Erro ao listar pastas:", error);
          if (active) setLoadError(true);
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <SecondaryView labelControls="Minhas Pastas">
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/folder/createFolder")}
        className="bg-azul-primario py-4 rounded-full"
      >
        <Text className="text-white text-center">Adicionar Pasta +</Text>
      </Pressable>

      {loading ? (
        <Text className="text-center text-gray-500">Carregando pastas...</Text>
      ) : loadError ? (
        <Text className="text-center text-gray-500">
          Não foi possível carregar as pastas. Tente voltar e abrir esta tela
          novamente.
        </Text>
      ) : (
        <FlatList
          data={folders}
          keyExtractor={(folder) => folder.id}
          style={{ flex: 1 }}
          renderItem={({ item }) => <FolderCard folder={item} />}
          contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
          ListEmptyComponent={
            <Text className="text-center text-gray-500">
              Nenhuma pasta salva.
            </Text>
          }
        />
      )}
    </SecondaryView>
  );
}
