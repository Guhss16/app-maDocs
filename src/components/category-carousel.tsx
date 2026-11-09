import { router } from "expo-router";
import { FlatList, Pressable, Text } from "react-native";

type Category = {
  id: string;
  label: string;
  color: string;
};

type CategoryCarouselProps = {
  categories: Category[];
};

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  return (
    <FlatList
      data={categories}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(category) => category.id}
      contentContainerStyle={{
        alignItems: "flex-start",
        gap: 12,
        paddingBottom: 8,
      }}
      renderItem={({ item }) => (
        <Pressable
          className="rounded-xl bg-[#D9D9D940] px-4 py-6 shadow-sm"
          style={{ borderLeftWidth: 4, borderLeftColor: item.color }}
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: "/category/[category]",
              params: { category: item.id },
            })
          }
        >
          <Text
            className="text-base font-semibold text-azul-primario"
            numberOfLines={1}
          >
            {item.label}
          </Text>
        </Pressable>
      )}
    />
  );
}
