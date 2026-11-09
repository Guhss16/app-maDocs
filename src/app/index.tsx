import { Logo } from "@/assets/images/logo";
import { CategoryCarousel } from "@/components/category-carousel";
import { DocumentCard } from "@/components/documentCard";
import { Menu } from "@/components/menu";
import { SearchField } from "@/components/search-field";
import { CATEGORIES } from "@/constants/categories";
import { listDocuments, type Document } from "@/data/documents";

import "@/global.css";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";

const categories = Object.entries(CATEGORIES).map(([id, category]) => ({
  id,
  ...category,
}));

export default function TabLayout() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState("");
  const query = search.trim().toLocaleLowerCase();
  const displayedDocuments = useMemo(
    () =>
      query
        ? documents.filter((document) =>
            document.name.toLocaleLowerCase().includes(query),
          )
        : documents.filter((document) => document.quick_access === 1),
    [documents, query],
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;

      listDocuments()
        .then((documents) => {
          if (active) setDocuments(documents);
        })
        .catch((error) => {
          console.error("Erro ao listar documentos:", error);
          if (active) {
            Alert.alert("Erro", "Não foi possível carregar os documentos.");
          }
        });

      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <View className="flex-1 bg-azul-primario">
      <View className="mt-[40px] mb-[30px] items-center gap-[24px] px-[20px] pt-[20px]">
        <Logo color="white" />
        <SearchField value={search} onChangeText={setSearch} />
      </View>
      <FlatList
        data={displayedDocuments}
        keyExtractor={(doc) => doc.id}
        className="flex-1 rounded-t-[20px] bg-white"
        contentContainerStyle={{ padding: 20, paddingBottom: 28 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListHeaderComponent={!query ? (
          <View className="gap-5 pb-3">
            <View>
              <View className="flex flex-row gap-[5px]">
                <Text className="text-start text-2xl text-azul-primario font-normal">
                  Bem-vindo ao
                </Text>
                <Logo color="#3E5DF9" className="pb-2" />
              </View>
              <Text className="text-lg italic font-light">
                Acesso rápido de documentos!
              </Text>
            </View>
            <Menu
              onAddDocumentPress={() => router.push("/add-docs")}
              onArchivePress={() => router.push("/my-docs")}
              onOpenFolders={() => router.push("/folders")}
              onSettingsPress={() => router.push("/settings")}
            />
            <View className="gap-3">
              <Text className="text-lg font-semibold text-azul-primario">
                Categorias
              </Text>
              <CategoryCarousel categories={categories} />
            </View>
            <Text className="text-lg font-semibold text-azul-primario">
              Acesso Rápido
            </Text>
          </View>
        ) : undefined}
        renderItem={({ item }) => (
          <DocumentCard
            doc={item}
            fullWidth
            onPress={() =>
              router.push({
                pathname: "/document/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text className="text-sm text-gray-500">
            {query
              ? "Nenhum documento encontrado."
              : "Nenhum documento marcado com acesso rápido."}
          </Text>
        }
      />
    </View>
  );
}
