import { Arrow } from "@/assets/images/arrow";
import SecondaryView from "@/components/layout/secondary-view";
import { CATEGORIES, type CategoryKey } from "@/constants/categories";
import { createDocument, listDocuments } from "@/data/documents";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function TabLayout() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [categoryListOpen, setCategoryListOpen] = useState(false);
  const [pdf, setPdf] = useState<{ uri: string; name: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function handlePickPdf() {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: false,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    setPdf({ uri: asset.uri, name: asset.name });
    console.log("URI do PDF:", asset.uri);
  }

  async function handleSave() {
    console.log("1. clicou em salvar", { name, category, pdf });

    if (!name.trim() || !category || !pdf) {
      console.log("2. validação barrou");
      Alert.alert(
        "Faltam dados",
        "Informe o nome, a categoria e anexe um PDF.",
      );
      return;
    }

    setSaving(true);
    try {
      console.log("3. chamando createDocument");
      await createDocument({
        name: name.trim(),
        category,
        pdfUri: pdf.uri,
        documentNumber: number.trim() || undefined,
      });
      console.log("4. createDocument terminou");

      const todos = await listDocuments();
      console.log("5. Documentos no banco:", todos);

      router.back();
    } catch (error) {
      console.error("Erro ao salvar documento:", error);
      Alert.alert("Erro", "Não foi possível salvar o documento.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SecondaryView labelControls="Adicionar Documento">
      <View className="flex flex-col gap-8 ">
        <TextInput
          placeholder="Nome do documento*"
          value={name}
          onChangeText={setName}
          className="bg-[#D9D9D9] rounded-full pl-4 text-xl placeholder:text-[#8C8C8C] placeholder:text-lg shadow-sm"
        ></TextInput>
        <TextInput
          placeholder="Número (opcional)"
          value={number}
          onChangeText={setNumber}
          className="bg-[#D9D9D9] rounded-full pl-4 text-xl placeholder:text-[#8C8C8C] placeholder:text-lg shadow-sm"
        ></TextInput>

        <View className="gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: categoryListOpen }}
            onPress={() => setCategoryListOpen((open) => !open)}
            className="flex-row items-center justify-between rounded-full bg-[#D9D9D9] px-4 py-3 shadow-sm"
          >
            <Text
              className={
                category ? "text-lg text-black" : "text-lg text-[#8C8C8C]"
              }
            >
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
              {Object.entries(CATEGORIES).map(([key, { label, color }]) => {
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
                      style={{ backgroundColor: color }}
                    />
                    <Text
                      className="text-base"
                      style={{ color, fontWeight: selected ? "700" : "400" }}
                    >
                      {label}
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
        <Pressable
          onPress={handlePickPdf}
          className="bg-[#D9D9D9] h-[20vh] rounded-lg text-xl shadow-sm items-center justify-center"
        >
          <Text className="text-center text-[#8C8C8C] px-[20px]">
            {pdf ? `📄 ${pdf.name}` : "Anexar PDF"}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleSave}
          disabled={saving}
          className="rounded-full bg-azul-primario py-3 shadow-sm"
        >
          <Text className="text-white font-bold text-center text-lg">
            {saving ? "Salvando..." : "Salvar"}
          </Text>
        </Pressable>
      </View>
    </SecondaryView>
  );
}
