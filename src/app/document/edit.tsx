import { Arrow } from "@/assets/images/arrow";
import SecondaryView from "@/components/layout/secondary-view";
import { CATEGORIES, type CategoryKey } from "@/constants/categories";
import {
  getDocumentById,
  updateDocumentById,
  type Document,
} from "@/data/documents";
import { listFolders, type Folder } from "@/data/folder";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function DocumentEdit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [categoryListOpen, setCategoryListOpen] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [folderListOpen, setFolderListOpen] = useState(false);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [folderLoadError, setFolderLoadError] = useState(false);
  const [folderLoadAttempt, setFolderLoadAttempt] = useState(0);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      setLoadingFolders(true);
      setFolderLoadError(false);
      listFolders()
        .then((result) => {
          if (active) setFolders(result);
        })
        .catch((error) => {
          console.error("Erro ao listar pastas:", error);
          if (active) setFolderLoadError(true);
        })
        .finally(() => {
          if (active) setLoadingFolders(false);
        });

      return () => {
        active = false;
      };
    }, [folderLoadAttempt]),
  );

  useEffect(() => {
    setLoading(true);
    setDoc(null);
    getDocumentById(id)
      .then((result) => {
        setDoc(result);
        if (result) {
          setName(result.name);
          setNumber(result.document_number ?? "");
          setCategory(result.category);
          setFolderId(result.folder_id);
        }
      })
      .catch((error) => console.error("Erro ao buscar documento:", error))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    if (!doc || !name.trim() || !category) {
      Alert.alert("Faltam dados", "Informe o nome e a categoria.");
      return;
    }

    setSaving(true);
    try {
      await updateDocumentById(doc.id, {
        name: name.trim(),
        category,
        documentNumber: number.trim() || null,
        folderId,
      });
      router.back();
    } catch (error) {
      console.error("Erro ao atualizar documento:", error);
      Alert.alert("Erro", "Não foi possível atualizar o documento.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SecondaryView labelControls="Editar Documento">
        <Text>Carregando documento...</Text>
      </SecondaryView>
    );
  }

  if (!doc) {
    return (
      <SecondaryView labelControls="Editar Documento">
        <Text>Documento não encontrado.</Text>
      </SecondaryView>
    );
  }

  return (
    <SecondaryView labelControls="Editar Documento">
      <View className="flex flex-col gap-8">
        <View className="flex flex-col gap-2">
          <Text className="pl-2">Nome do Documento</Text>
          <TextInput
            placeholder="Nome do documento*"
            value={name}
            onChangeText={setName}
            className="bg-[#D9D9D9] rounded-full pl-4 text-xl placeholder:text-[#8C8C8C] placeholder:text-lg shadow-sm"
          />
        </View>
        <View className="flex flex-col gap-2">
          <Text className="pl-2">Nº do Documento</Text>
          <TextInput
            placeholder="Número (opcional)"
            value={number}
            onChangeText={setNumber}
            className="bg-[#D9D9D9] rounded-full pl-4 text-xl placeholder:text-[#8C8C8C] placeholder:text-lg shadow-sm"
          />
        </View>

        <View className="gap-2">
          <Text className="pl-2">Categoria</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: categoryListOpen }}
            onPress={() => setCategoryListOpen((open) => !open)}
            className="flex-row items-center justify-between rounded-full bg-[#D9D9D9] px-4 py-3 shadow-sm"
          >
            <Text className="text-lg text-black">
              {category
                ? CATEGORIES[category].label
                : "Selecione uma categoria*"}
            </Text>
            <Arrow
              color="#8C8C8C"
              width={16}
              direction={categoryListOpen ? "up" : "down"}
            />
          </Pressable>
          {categoryListOpen && (
            <View className="overflow-hidden rounded-2xl bg-[#D9D9D9]">
              {Object.entries(CATEGORIES).map(([key, value]) => {
                const categoryKey = key as CategoryKey;
                const selected = category === categoryKey;

                return (
                  <Pressable
                    key={categoryKey}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      setCategory(categoryKey);
                      setCategoryListOpen(false);
                    }}
                    className="flex-row items-center gap-3 px-4 py-3 shadow-sm"
                  >
                    <View
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: value.color }}
                    />
                    <Text
                      className="text-base"
                      style={{
                        color: value.color,
                        fontWeight: selected ? "700" : "400",
                      }}
                    >
                      {value.label}
                    </Text>
                    {selected && (
                      <Text className="ml-auto text-azul-primario">
                        SELECIONADO
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        <View className="gap-2">
          <Text className="pl-2">Pasta</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: folderListOpen }}
            onPress={() => setFolderListOpen((open) => !open)}
            disabled={loadingFolders || folderLoadError}
            className="flex-row items-center justify-between rounded-full bg-[#D9D9D9] px-4 py-3 shadow-sm"
          >
            <Text
              className={`text-lg ${
                folderId ? "text-black" : "text-[#8C8C8C]"
              }`}
            >
              {loadingFolders
                ? "Carregando pastas..."
                : folderLoadError
                  ? "Pastas indisponíveis"
                  : (folders.find((folder) => folder.id === folderId)?.name ??
                    "Nenhuma pasta")}
            </Text>
            <Arrow
              color="#8C8C8C"
              width={16}
              direction={folderListOpen ? "up" : "down"}
            />
          </Pressable>
          {folderListOpen && !loadingFolders && !folderLoadError && (
            <View className="overflow-hidden rounded-2xl bg-[#D9D9D9]">
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: folderId === null }}
                onPress={() => {
                  setFolderId(null);
                  setFolderListOpen(false);
                }}
                className="flex-row items-center justify-between px-4 py-3 shadow-sm"
              >
                <Text className="text-base text-gray-600">Nenhuma pasta</Text>
                {folderId === null && (
                  <Text className="font-semibold text-azul-primario">
                    SELECIONADA
                  </Text>
                )}
              </Pressable>
              {folders.map((folder) => {
                const selected = folderId === folder.id;

                return (
                  <Pressable
                    key={folder.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      setFolderId(folder.id);
                      setFolderListOpen(false);
                    }}
                    className="flex-row items-center justify-between px-4 py-3 shadow-sm"
                  >
                    <Text className="text-base">{folder.name}</Text>
                    {selected && (
                      <Text className="font-semibold text-azul-primario">
                        SELECIONADA
                      </Text>
                    )}
                  </Pressable>
                );
              })}
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push("/folder/createFolder")}
                className="flex-row items-center px-4 py-3 shadow-sm"
              >
                <Text className="text-base font-semibold text-azul-primario">
                  + Criar pasta
                </Text>
              </Pressable>
              {folders.length === 0 && (
                <Text className="px-4 py-3 text-gray-500">
                  Nenhuma pasta criada.
                </Text>
              )}
            </View>
          )}
          {folderLoadError && (
            <Pressable
              accessibilityRole="button"
              onPress={() => setFolderLoadAttempt((attempt) => attempt + 1)}
            >
              <Text className="px-4 font-semibold text-azul-primario">
                Tentar carregar pastas novamente
              </Text>
            </Pressable>
          )}
        </View>

        <Text className="text-sm text-gray-500">
          O arquivo PDF atual será mantido.
        </Text>

        <Pressable
          onPress={handleSave}
          disabled={saving || loadingFolders || folderLoadError}
          className={`rounded-full bg-azul-primario py-3 shadow-sm ${
            saving || loadingFolders || folderLoadError ? "opacity-60" : ""
          }`}
        >
          <Text className="text-white font-bold text-center text-lg">
            {saving ? "Salvando..." : "Salvar alterações"}
          </Text>
        </Pressable>
      </View>
    </SecondaryView>
  );
}
