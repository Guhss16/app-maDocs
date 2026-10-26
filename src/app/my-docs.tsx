import { DocumentCard } from "@/components/DocumentCard";
import { Document, listDocuments } from "@/data/documents";
import { getVaultFileUri } from "@/data/files";
import { useFocusEffect } from "expo-router";
import * as Sharing from "expo-sharing";
import { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";

export default function SavedDocuments() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

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
      await Sharing.shareAsync(getVaultFileUri(doc.file_path), {
        mimeType: "application/pdf",
        dialogTitle: doc.name,
      });
    } catch (error) {
      console.error("Erro ao abrir PDF:", error);
      Alert.alert("Erro", "Não foi possível abrir o documento.");
    }
  }

  if (loading) return null;

  return (
    <FlatList
      data={docs}
      keyExtractor={(doc) => doc.id}
      renderItem={({ item }) => (
        <DocumentCard doc={item} onPress={handleOpen} />
      )}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhum documento salvo ainda.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 12, flexGrow: 1 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#6B7280" },
});
