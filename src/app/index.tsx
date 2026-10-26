import { Logo } from "@/assets/images/logo";
import { Menu } from "@/components/menu";
import { SearchField } from "@/components/search-field";

import "@/global.css";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-azul-primario">
      <View className="mt-[40px] mb-[30px] items-center gap-[24px] px-[20px] pt-[20px]">
        <Logo color="white" />
        <SearchField />
      </View>
      <View className="bg-white rounded-t-[20px] h-full p-[20px] flex flex-col gap-[20px]">
        <View>
          <View className="flex flex-row gap-[5px]">
            <Text className="text-start text-2xl text-azul-primario font-normal">
              Bem-vindo ao
            </Text>
            <Logo color="#3E5DF9" className="pb-2" />
          </View>
          <Text className="text-lg italic font-light">
            Acesso rápido de documentos!
          </Text>
        </View>
        <Menu
          onAddDocumentPress={() => router.push("/add-docs")}
          onArchivePress={() => router.push("/my-docs")}
        />
      </View>
    </View>
  );
}
