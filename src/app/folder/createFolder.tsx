import { Arrow } from "@/assets/images/arrow";
import SecondaryView from "@/components/layout/secondary-view";
import type { Document } from "@/data/documents";
import { createFolder, listUnfiledDocuments } from "@/data/folder";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function CreateFolder() {
  const [name, setName] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [documentListOpen, setDocumentListOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setLoadError(false);
    listUnfiledDocuments()
      .then((result) => {
        if (active) setDocuments(result);
      })
      .catch((error) => {
        console.error("Erro ao listar documentos sem pasta:", error);
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

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

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert("Falta o nome", "Informe um nome para a pasta.");
      return;
    }

    setSaving(true);
    try {
      await createFolder(name, [...selectedDocumentIds]);
      router.back();
    } catch (error) {
      console.error("Erro ao criar pasta:", error);
      Alert.alert(
        "Erro",
        error instanceof Error &&
          error.message.includes("já pertencem a uma pasta")
          ? error.message
          : "Não foi possível criar a pasta.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <SecondaryView labelControls="Criar Pasta">
      <TextInput
        accessibilityLabel="Nome da pasta"
        placeholder="Nome da pasta*"
        value={name}
        onChangeText={setName}
        maxLength={100}
        returnKeyType="done"
        className="rounded-full bg-[#D9D9D9] pl-4 text-xl placeholder:text-[#8C8C8C] placeholder:text-lg shadow-sm"
      />

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
          (loading ? (
            <ActivityIndicator
              accessibilityLabel="Carregando documentos"
              color="#3E5DF9"
            />
          ) : loadError ? (
            <View className="items-center gap-2">
              <Text className="text-center text-gray-500">
                Não foi possível carregar os documentos.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => setReloadKey((key) => key + 1)}
              >
                <Text className="font-semibold text-azul-primario">
                  Tentar novamente
                </Text>
              </Pressable>
            </View>
          ) : documents.length === 0 ? (
            <Text className="text-center text-gray-500">
              Não há documentos sem pasta.
            </Text>
          ) : (
            <FlatList
              data={documents}
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
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handleSave}
        disabled={saving || loading || loadError}
        className={`rounded-full bg-azul-primario py-3 shadow-sm ${
          saving || loading || loadError ? "opacity-60" : ""
        }`}
      >
        <Text className="text-center text-lg font-bold text-white">
          {saving ? "Criando..." : "Criar pasta"}
        </Text>
      </Pressable>
    </SecondaryView>
  );
}
