import { Logo } from "@/assets/images/logo";
import { View } from "react-native";

export default function SecondaryView({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View className="flex-1 bg-azul-primario">
      <View className="mt-[40px] mb-[30px] items-center gap-[24px] px-[20px] pt-[20px]">
        <Logo color="white" />
      </View>
      <View className="bg-white rounded-t-[20px] h-full p-[20px] flex flex-col gap-[20px]">
        {children}
      </View>
    </View>
  );
}
