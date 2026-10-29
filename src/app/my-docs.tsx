import { DocumentCard } from "@/components/documentCard";
import SecondaryView from "@/components/layout/secondary-view";
import { SearchField } from "@/components/search-field";
import { Document, listDocuments } from "@/data/documents";
import { openPdf } from "@/data/pdfActions";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, Text } from "react-native";

export default function SavedDocuments() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const filteredDocs = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return docs.filter((doc) => doc.name.toLocaleLowerCase().startsWith(query));
  }, [docs, search]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      listDocuments()
        .then((result) => {
          if (active) setDocs(result);
        })
        .catch((error) => console.error("Erro ao listar documentos:", error))
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, []),
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

  return (
    <SecondaryView labelControls="Meus Documentos">
      <SearchField value={search} onChangeText={setSearch} />
      <FlatList
        data={filteredDocs}
        keyExtractor={(doc) => doc.id}
        contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <DocumentCard doc={item} onPress={handleOpen} />
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500">
            Nenhum documento salvo ainda.
          </Text>
        }
      />
    </SecondaryView>
  );
}
