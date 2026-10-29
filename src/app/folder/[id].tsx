import { Arrow } from "@/assets/images/arrow";
import { DocumentCard } from "@/components/documentCard";
import SecondaryView from "@/components/layout/secondary-view";
import type { Document } from "@/data/documents";
import {
  addDocumentsToFolder,
  deleteFolderById,
  getFolderById,
  listDocumentsInFolder,
  listUnfiledDocuments,
  type Folder,
} from "@/data/folder";
import { openPdf } from "@/data/pdfActions";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

export default function FolderDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [folder, setFolder] = useState<Folder | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [unfiledDocuments, setUnfiledDocuments] = useState<Document[]>([]);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<Set<string>>(
    new Set(),
  );
  const [documentListOpen, setDocumentListOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setLoadError(false);

      Promise.all([
        getFolderById(id),
        listDocumentsInFolder(id),
        listUnfiledDocuments(),
      ])
        .then(([folderResult, documentResults, unfiledResults]) => {
          if (!active) return;
          setFolder(folderResult);
          setDocuments(documentResults);
          setUnfiledDocuments(unfiledResults);
          setSelectedDocumentIds(new Set());
        })
        .catch((error) => {
          console.error("Erro ao carregar pasta:", error);
          if (active) setLoadError(true);
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, [id]),
  );

  function toggleDocument(documentId: string) {
    setSelectedDocumentIds((current) => {
      const next = new Set(current);
      if (next.has(documentId)) {
        next.delete(documentId);
      } else {
        next.add(documentId);
      }
      return next;
    });
  }

  async function handleAddDocuments() {
    if (selectedDocumentIds.size === 0) return;

    setSaving(true);
    try {
      await addDocumentsToFolder(id, [...selectedDocumentIds]);
      const [updatedFolder, updatedDocuments, updatedUnfiledDocuments] =
        await Promise.all([
          getFolderById(id),
          listDocumentsInFolder(id),
          listUnfiledDocuments(),
        ]);
      setFolder(updatedFolder);
      setDocuments(updatedDocuments);
      setUnfiledDocuments(updatedUnfiledDocuments);
      setSelectedDocumentIds(new Set());
      setDocumentListOpen(false);
    } catch (error) {
      console.error("Erro ao adicionar documentos à pasta:", error);
      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Não foi possível adicionar os documentos.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleDeleteFolder() {
    if (!folder || folder.documentCount > 0) return;

    Alert.alert("Excluir pasta", `Deseja excluir a pasta "${folder.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteFolderById(folder.id);
            router.back();
          } catch (error) {
            console.error("Erro ao excluir pasta:", error);
            Alert.alert(
              "Não foi possível excluir",
              error instanceof Error
                ? error.message
                : "Verifique se a pasta está vazia.",
            );
          }
        },
      },
    ]);
  }

  async function handleOpenDocument(document: Document) {
    try {
      await openPdf(document.file_path, document.name);
    } catch (error) {
      console.error("Erro ao abrir PDF:", error);
      Alert.alert(
        "Não foi possível abrir",
        "Verifique se há um app leitor de PDF instalado, ou use a opção de compartilhar.",
      );
    }
  }

  if (loading) {
    return (
      <SecondaryView labelControls="Pasta">
        <ActivityIndicator accessibilityLabel="Carregando pasta" />
      </SecondaryView>
    );
  }

  if (loadError) {
    return (
      <SecondaryView labelControls="Pasta">
        <Text className="text-center text-gray-500">
          Não foi possível carregar esta pasta.
        </Text>
      </SecondaryView>
    );
  }

  if (!folder) {
    return (
      <SecondaryView labelControls="Pasta">
        <Text className="text-center text-gray-500">Pasta não encontrada.</Text>
      </SecondaryView>
    );
  }

  return (
    <SecondaryView labelControls={folder.name}>
      <View className="gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: documentListOpen }}
          onPress={() => setDocumentListOpen((open) => !open)}
          className="flex-row items-center justify-between rounded-full bg-[#D9D9D9] px-4 py-3 shadow-sm"
        >
          <Text className="text-lg text-black">
            {selectedDocumentIds.size > 0
              ? `${selectedDocumentIds.size} documento(s) selecionado(s)`
              : "Adicionar documentos"}
          </Text>
          <Arrow
            color="#8C8C8C"
            width={16}
            direction={documentListOpen ? "up" : "down"}
          />
        </Pressable>

        {documentListOpen &&
          (unfiledDocuments.length === 0 ? (
            <Text className="text-center text-gray-500">
              Não há documentos sem pasta para adicionar.
            </Text>
          ) : (
            <FlatList
              data={unfiledDocuments}
              keyExtractor={(document) => document.id}
              style={{ maxHeight: 240 }}
              contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
              renderItem={({ item }) => {
                const selected = selectedDocumentIds.has(item.id);

                return (
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                    onPress={() => toggleDocument(item.id)}
                    className="flex-row items-center gap-3 rounded-xl bg-[#D9D9D9] px-4 py-3"
                  >
                    <View
                      className={`h-6 w-6 items-center justify-center rounded border ${
                        selected
                          ? "border-azul-primario bg-azul-primario"
                          : "border-gray-500 bg-white"
                      }`}
                    >
                      {selected && (
                        <Text className="font-bold text-white">✓</Text>
                      )}
                    </View>
                    <Text className="flex-1 text-base">{item.name}</Text>
                  </Pressable>
                );
              }}
            />
          ))}

        {documentListOpen && unfiledDocuments.length > 0 && (
          <Pressable
            accessibilityRole="button"
            onPress={handleAddDocuments}
            disabled={saving || selectedDocumentIds.size === 0}
            className={`rounded-full bg-azul-primario py-3 ${
              saving || selectedDocumentIds.size === 0 ? "opacity-60" : ""
            }`}
          >
            <Text className="text-center font-bold text-white">
              {saving ? "Adicionando..." : "Adicionar selecionados"}
            </Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={documents}
        keyExtractor={(document) => document.id}
        style={{ flexGrow: 0, maxHeight: 240 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <DocumentCard doc={item} onPress={handleOpenDocument} />
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500">
            Esta pasta ainda não tem documentos.
          </Text>
        }
      />

      {folder.documentCount === 0 ? (
        <Pressable
          accessibilityRole="button"
          onPress={handleDeleteFolder}
          className="rounded bg-red-500 p-4 shadow-sm"
        >
          <Text className="text-center font-semibold text-white">
            Excluir pasta
          </Text>
        </Pressable>
      ) : (
        <Text className="text-center text-sm text-gray-500">
          Para excluir a pasta, primeiro remova todos os documentos.
        </Text>
      )}
    </SecondaryView>
  );
}
