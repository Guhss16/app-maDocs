import SecondaryView from "@/components/layout/secondary-view";
import {
  countDocuments,
  deleteAllDocumentsAndFolders,
  getTotalDocumentSize,
} from "@/data/documents";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Platform, Pressable, Text, View } from "react-native";

function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toLocaleString("pt-BR", {
    maximumFractionDigits: unitIndex === 0 ? 0 : 1,
  })} ${units[unitIndex]}`;
}

function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    globalThis.alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}

export default function Settings() {
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [totalBytes, setTotalBytes] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  async function handleClearAll() {
    if (isClearing) return;

    setIsClearing(true);
    try {
      await deleteAllDocumentsAndFolders();
      setTotal(0);
      setTotalBytes(0);
      setError(false);
      showMessage("Concluído", "Todos os documentos e pastas foram apagados.");
    } catch (cause) {
      console.error("Erro ao apagar documentos e pastas:", cause);
      showMessage(
        "Não foi possível apagar tudo",
        cause instanceof Error
          ? cause.message
          : "Ocorreu um erro ao apagar documentos e pastas.",
      );
    } finally {
      setIsClearing(false);
    }
  }

  function confirmClearAll() {
    const title = "Apagar tudo?";
    const message =
      "Esta ação excluirá permanentemente todos os documentos e pastas criadas.";

    if (Platform.OS === "web") {
      if (globalThis.confirm(`${title}\n\n${message}`)) {
        void handleClearAll();
      }
      return;
    }

    Alert.alert(
      title,
      message,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar tudo",
          style: "destructive",
          onPress: () => void handleClearAll(),
        },
      ],
      { cancelable: true },
    );
  }

  useFocusEffect(
    useCallback(() => {
      let active = true;

      Promise.all([countDocuments(), getTotalDocumentSize()])
        .then(([count, bytes]) => {
          if (active) {
            setTotal(count);
            setTotalBytes(bytes);
            setError(false);
          }
        })
        .catch((cause) => {
          console.error("Erro ao carregar informações dos documentos:", cause);
          if (active) setError(true);
        });

      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <SecondaryView labelControls="Configurações">
      <View>
        <Text className="mt-1 text-sm text-gray-600">
          {error
            ? "Não foi possível carregar as informações dos documentos."
            : total === null
              ? "Carregando documentos..."
              : `Quantidade de Documentos: ${total} ${total === 1 ? "Documento" : "Documentos"}`}
        </Text>
        <Text className="mt-1 text-sm text-gray-600">
          {error
            ? "Não foi possível carregar o espaço ocupado."
            : totalBytes === null
              ? "Calculando espaço ocupado..."
              : `Espaço ocupado: ${formatFileSize(totalBytes)}`}
        </Text>
      </View>

      <Pressable
        onPress={() => router.push("/privacy")}
        className="bg-azul-primario py-4 rounded"
      >
        <Text className="text-white text-center">Politica de Privacidade</Text>
      </Pressable>
      <Pressable
        onPress={confirmClearAll}
        disabled={isClearing}
        className="bg-red-500 p-4 rounded shadow-sm"
      >
        <Text className="text-white text-center font-semibold">
          {isClearing ? "Apagando..." : "Apagar Tudo"}
        </Text>
      </Pressable>
      <Text className="text-center text-sm text-gray-500">
        Apaga todos os documentos salvos e pastas criadas.
      </Text>
    </SecondaryView>
  );
}
