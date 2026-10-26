import { CATEGORIES } from "@/constants/categories";
import type { Document } from "@/data/documents";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  doc: Document;
  onPress: (doc: Document) => void;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// "2027-03-15" -> "15/03/2027"
function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export function DocumentCard({ doc, onPress }: Props) {
  const category = CATEGORIES[doc.category];

  return (
    <Pressable style={styles.card} onPress={() => onPress(doc)}>
      <View style={[styles.stripe, { backgroundColor: category.color }]} />

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {doc.name}
        </Text>
        <Text style={[styles.category, { color: category.color }]}>
          {category.label}
        </Text>

        {doc.document_number && (
          <Text style={styles.detail}>Nº {doc.document_number}</Text>
        )}
        {doc.expires_at && (
          <Text style={styles.detail}>
            Vence em {formatDate(doc.expires_at)}
          </Text>
        )}
      </View>

      <Text style={styles.size}>{formatFileSize(doc.file_size)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  stripe: { width: 6, alignSelf: "stretch" },
  content: { flex: 1, padding: 14, gap: 2 },
  name: { fontSize: 16, fontWeight: "600" },
  category: { fontSize: 13, fontWeight: "500" },
  detail: { fontSize: 12, color: "#6B7280" },
  size: { fontSize: 12, color: "#9CA3AF", paddingRight: 14 },
});
