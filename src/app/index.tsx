import { Logo } from "@/assets/images/logo";
import { CategoryCarousel } from "@/components/category-carousel";
import { DocumentCard } from "@/components/documentCard";
import { Menu } from "@/components/menu";
import { SearchField } from "@/components/search-field";
import { CATEGORIES } from "@/constants/categories";
import { listQuickAccessDocuments, type Document } from "@/data/documents";

import "@/global.css";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, ScrollView, Text, View } from "react-native";

const categories = Object.entries(CATEGORIES).map(([id, category]) => ({
  id,
  ...category,
}));

export default function TabLayout() {
  const router = useRouter();
  const [quickAccessDocs, setQuickAccessDocs] = useState<Document[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      listQuickAccessDocuments()
        .then((documents) => {
          if (active) setQuickAccessDocs(documents);
        })
        .catch((error) => {
          console.error("Erro ao listar documentos de acesso rápido:", error);
          if (active) {
            Alert.alert(
              "Erro",
              "Não foi possível carregar os documentos de acesso rápido.",
            );
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
        <SearchField />
      </View>
      <ScrollView
        className="flex-1 rounded-t-[20px] bg-white"
        contentContainerStyle={{ padding: 20, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
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
        <View className="gap-3">
          <Text className="text-lg font-semibold text-azul-primario">
            Acesso Rápido
          </Text>
          <FlatList
            data={quickAccessDocs}
            keyExtractor={(doc) => doc.id}
            contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
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
                Nenhum documento marcado com acesso rápido.
              </Text>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}
