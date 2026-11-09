import { DocumentCard } from "@/components/documentCard";
import SecondaryView from "@/components/layout/secondary-view";
import { SearchField } from "@/components/search-field";
import { CATEGORIES, type CategoryKey } from "@/constants/categories";
import { type Document, listDocumentsByCategory } from "@/data/documents";
import { openPdf } from "@/data/pdfActions";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, Text } from "react-native";

function isCategoryKey(value: string): value is CategoryKey {
  return Object.keys(CATEGORIES).some((key) => key === value);
}

export default function CategoryDocuments() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const selectedCategory =
    typeof category === "string" && isCategoryKey(category) ? category : null;

  const filteredDocs = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return docs.filter((doc) => doc.name.toLocaleLowerCase().startsWith(query));
  }, [docs, search]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      if (!selectedCategory) {
        setLoading(false);
        return () => {
          active = false;
        };
      }

      setLoading(true);
      listDocumentsByCategory(selectedCategory)
        .then((result) => {
          if (active) setDocs(result);
        })
        .catch((error) =>
          console.error("Erro ao listar documentos da categoria:", error),
        )
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, [selectedCategory]),
  );

  async function handleOpen(doc: Document) {
    try {
      await openPdf(doc.file_path, doc.name);
    } catch {
      Alert.alert(
        "Não foi possível abrir",
        "Verifique se há um app leitor de PDF instalado.",
      );
    }
  }

  if (loading) return null;

  if (!selectedCategory) {
    return (
      <SecondaryView labelControls="Categoria não encontrada">
        <Text className="text-center text-gray-500">
          Não foi possível encontrar esta categoria.
        </Text>
      </SecondaryView>
    );
  }

  return (
    <SecondaryView
      labelControls={CATEGORIES[selectedCategory].label}
      scrollable={false}
    >
      <SearchField value={search} onChangeText={setSearch} />
      <FlatList
        data={filteredDocs}
        keyExtractor={(doc) => doc.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <DocumentCard doc={item} onPress={handleOpen} />
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500">
            Nenhum documento nesta categoria.
          </Text>
        }
      />
    </SecondaryView>
  );
}
