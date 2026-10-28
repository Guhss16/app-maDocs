import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import { getVaultFileUri } from "./files";

// Menu de compartilhar do sistema (WhatsApp, e-mail, Drive...)
export async function sharePdf(filePath: string, title: string) {
  await Sharing.shareAsync(getVaultFileUri(filePath), {
    mimeType: "application/pdf",
    UTI: "com.adobe.pdf",
    dialogTitle: title,
  });
}

// Abre direto num app que aceite PDF
export async function openPdf(filePath: string, title: string) {
  if (Platform.OS === "android") {
    const contentUri = await FileSystem.getContentUriAsync(
      getVaultFileUri(filePath),
    );
    await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      data: contentUri,
      flags: 1, // dá permissão de leitura temporária ao app que abrir
      type: "application/pdf",
    });
  } else {
    // iOS não tem "abrir com" direto: o share sheet mostra a prévia e as opções
    await sharePdf(filePath, title);
  }
}
