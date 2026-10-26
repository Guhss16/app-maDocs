import { Logo } from "@/assets/images/logo";
import { Menu } from "@/components/menu";
import { SearchField } from "@/components/search-field";

import "@/global.css";
import { Text, View } from "react-native";

export default function TabLayout() {
  return (
    <View className="flex-1 bg-azul-primario">
      <View className="mt-[40px] mb-[30px] items-center gap-[24px] p-[20px]">
        <Logo color="white" />
        <SearchField />
      </View>
      <View className="bg-white rounded-t-[20px] h-full p-[20px] flex flex-col gap-[20px]">
        <View>
          <Text className="text-start text-2xl text-azul-primario font-normal">
            Bem-vindo ao <Logo color="#3E5DF9" />
          </Text>
          <Text>Acesso rápido de documentos!</Text>
        </View>
        <Menu />
      </View>
    </View>
  );
}
