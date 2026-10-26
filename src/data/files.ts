import * as FileSystem from "expo-file-system/legacy";

const VAULT_DIR = "documents/";

export async function copyPdfToVault(sourceUri: string, id: string) {
  const dirUri = `${FileSystem.documentDirectory}${VAULT_DIR}`;
  await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });

  const filePath = `${VAULT_DIR}${id}.pdf`; // relativo, é isso que vai pro banco
  const destUri = `${FileSystem.documentDirectory}${filePath}`;

  await FileSystem.copyAsync({ from: sourceUri, to: destUri });

  const info = await FileSystem.getInfoAsync(destUri);
  if (!info.exists) throw new Error("Falha ao copiar o PDF");

  return { filePath, fileSize: info.size };
}

export async function deleteVaultFile(filePath: string) {
  await FileSystem.deleteAsync(`${FileSystem.documentDirectory}${filePath}`, {
    idempotent: true, // não dá erro se o arquivo já não existir
  });
}

export function getVaultFileUri(filePath: string) {
  return `${FileSystem.documentDirectory}${filePath}`;
}
