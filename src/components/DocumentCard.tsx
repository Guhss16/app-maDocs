import { EyeOpen } from "@/assets/images/eye-open";
import { CATEGORIES } from "@/constants/categories";
import type { Document } from "@/data/documents";
import { openPdf } from "@/data/pdfActions";
import { router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";

type Props = {
  doc: Document;
  onPress: (doc: Document) => void;
};

// "2027-03-15" -> "15/03/2027"
function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function handleOpenDocPage(doc: Document) {
  router.push({ pathname: "/document/[id]", params: { id: doc.id } });
}

async function handleOpenDetails(doc: Document) {
  try {
    await openPdf(doc.file_path, doc.name);
  } catch {
    Alert.alert(
      "Não foi possível abrir",
      "Verifique se há um app leitor de PDF instalado, ou use Compartilhar.",
    );
  }
}

export function DocumentCard({ doc, onPress }: Props) {
  const category = CATEGORIES[doc.category];

  return (
    <Pressable
      className="flex-row items-center bg-white rounded-xl overflow-hidden shadow-sm pr-4"
      onPress={() => onPress(doc)}
    >
      <View
        className="w-1.5 self-stretch"
        style={{ backgroundColor: category.color }}
      />

      <View className="flex-1 p-[14px] gap-0.5">
        <Text className="text-base font-semibold" numberOfLines={1}>
          {doc.name}
        </Text>
        <Text
          className="text-[13px] font-medium"
          style={{ color: category.color }}
        >
          {category.label}
        </Text>

        {doc.document_number && (
          <Text className="text-xs text-gray-500">
            Nº {doc.document_number}
          </Text>
        )}
        {doc.expires_at && (
          <Text className="text-xs text-gray-500">
            Vence em {formatDate(doc.expires_at)}
          </Text>
        )}
      </View>

      <Pressable
        onPress={() => handleOpenDocPage(doc)}
        className=" bg-azul-primario rounded-full p-2 shadow-sm"
      >
        <EyeOpen color="white" />
      </Pressable>
    </Pressable>
  );
}
