import { LoadingScreen } from "@/components/loading-screen";
import { initDatabase } from "@/data/database";
import "@/global.css";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

if (Platform.OS !== "web") {
  SplashScreen.preventAutoHideAsync().catch((error) =>
    console.error("Erro ao manter a tela nativa de abertura:", error),
  );
}

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const hasHiddenSplash = useRef(false);

  const handleLoadingLayout = useCallback(() => {
    if (Platform.OS === "web" || hasHiddenSplash.current) return;

    hasHiddenSplash.current = true;
    SplashScreen.hideAsync().catch((error) =>
      console.error("Erro ao ocultar a tela nativa de abertura:", error),
    );
  }, []);

  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      .catch((error) => console.error("Erro ao abrir o banco:", error));
  }, []);

  if (!dbReady) {
    return <LoadingScreen onLayout={handleLoadingLayout} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "simple_push",
        animationDuration: 250,
        gestureEnabled: true,
      }}
    />
  );
}
