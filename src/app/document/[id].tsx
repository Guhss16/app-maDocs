import SecondaryView from "@/components/layout/secondary-view";
import { CATEGORIES } from "@/constants/categories";
import {
  deleteDocumentById,
  getDocumentById,
  type Document,
} from "@/data/documents";
import { openPdf, sharePdf } from "@/data/pdfActions";

import * as Clipboard from "expo-clipboard";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

export default function DocumentDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      getDocumentById(id)
        .then((result) => {
          if (active) setDoc(result);
        })
        .catch((error) => {
          console.error("Erro ao buscar documento:", error);
          if (active) setDoc(null);
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, [id]),
  );

  // volta o botão para "Copiar" depois de 2 segundos
  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    if (!doc?.document_number) return;
    try {
      await Clipboard.setStringAsync(doc.document_number);
      setCopied(true);
    } catch (error) {
      console.error("Erro ao copiar número:", error);
    }
  }

  async function handleOpen() {
    if (!doc) return;
    try {
      await openPdf(doc.file_path, doc.name);
    } catch {
      Alert.alert(
        "Não foi possível abrir",
        "Verifique se há um app leitor de PDF instalado, ou use Compartilhar.",
      );
    }
  }

  async function handleShare() {
    if (!doc) return;
    try {
      await sharePdf(doc.file_path, doc.name);
    } catch {
      Alert.alert("Erro", "Não foi possível compartilhar o documento.");
    }
  }

  function handleDelete() {
    if (!doc) return;

    Alert.alert(
      "Apagar documento",
      "Tem certeza que deseja apagar este documento? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDocumentById(doc.id);
              router.back();
            } catch (error) {
              console.error("Erro ao apagar documento:", error);
              Alert.alert("Erro", "Não foi possível apagar o documento.");
            }
          },
        },
      ],
    );
  }

  if (loading) return null;

  if (!doc) {
    return (
      <SecondaryView>
        <Text>Documento não encontrado.</Text>
        <Pressable onPress={() => router.back()}>
          <Text className="text-azul-primario font-semibold">Voltar</Text>
        </Pressable>
      </SecondaryView>
    );
  }

  const category = CATEGORIES[doc.category];
  const folderId = doc.folder_id;

  return (
    <SecondaryView editavel doc={doc} className="flex flex-col">
      <View>
        <Text className="text-md">Documento</Text>
        <Text className="text-4xl font-semibold text-azul-primario uppercase">
          {doc.name}
        </Text>
      </View>

      <View className="flex flex-row gap-4">
        <View className="flex flex-col gap-2">
          <Text className="text-md">Categoria</Text>
          <Text
            className="self-start text-lg text-white w-fit font-bold px-4 py-1 rounded-full"
            style={{ backgroundColor: category.color }}
          >
            {category.label}
          </Text>
        </View>
        <View className="flex flex-col gap-2">
          <Text>Pasta</Text>
          {folderId && doc.folder_name ? (
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`Abrir pasta ${doc.folder_name}`}
              onPress={() =>
                router.push({
                  pathname: "/folder/[id]",
                  params: { id: folderId },
                })
              }
              className="self-start rounded-full bg-azul-primario px-4 py-1"
            >
              <Text className="text-lg font-semibold text-white">
                {doc.folder_name}
              </Text>
            </Pressable>
          ) : (
            <Text className="self-start text-lg font-semibold text-gray-500">
              Sem pasta
            </Text>
          )}
        </View>
      </View>

      <View className="flex flex-col gap-2">
        <Text className="text-sm text-gray-500">Número do Documento</Text>
        <View className="flex flex-row items-center justify-between gap-4 rounded bg-[#D9D9D950] py-4 px-4 shadow-sm">
          <Text className="text-base">
            {doc.document_number || "Não informado"}
          </Text>
          {doc.document_number && (
            <Pressable
              onPress={handleCopy}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={
                copied ? "Número copiado" : "Copiar número do documento"
              }
            >
              <Text className="text-azul-primario font-semibold">
                {copied ? "Copiado!" : "Copiar"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/*BOTÕES*/}
      <View className="flex flex-col gap-4 justify-self-end">
        <View className="flex flex-row gap-4">
          <Pressable
            onPress={handleOpen}
            className="flex-1 bg-azul-primario p-4 rounded shadow-sm"
          >
            <Text className="text-white text-center font-semibold">
              Abrir PDF
            </Text>
          </Pressable>
          <Pressable
            onPress={handleShare}
            className="flex-1 bg-yellow-400 p-4 rounded shadow-sm"
          >
            <Text className="text-black text-center font-semibold">
              Compartilhar
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleDelete}
          className="bg-red-500 p-4 rounded shadow-sm"
        >
          <Text className="text-white text-center font-semibold">
            Apagar Documento
          </Text>
        </Pressable>
      </View>
    </SecondaryView>
  );
}
