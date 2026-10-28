import { CategoryKey } from "@/constants/categories";
import { randomUUID } from "expo-crypto";
import { getDb } from "./database";
import { copyPdfToVault, deleteVaultFile } from "./files";

export type Document = {
  id: string;
  name: string;
  category: CategoryKey;
  document_number: string | null;
  expires_at: string | null;
  file_path: string;
  file_size: number;
};

export type NewDocument = {
  name: string;
  category: CategoryKey;
  pdfUri: string;
  documentNumber?: string;
  expiresAt?: string;
};

export async function createDocument(input: NewDocument) {
  const id = randomUUID();

  // 1º: copia o PDF para a pasta privada do app
  const file = await copyPdfToVault(input.pdfUri, id);

  try {
    // 2º: grava os metadados no banco
    await getDb().runAsync(
      `INSERT INTO documents
        (id, name, category, document_number, expires_at, file_path, file_size)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.name,
        input.category,
        input.documentNumber ?? null,
        input.expiresAt ?? null,
        file.filePath,
        file.fileSize,
      ],
    );
  } catch (error) {
    await deleteVaultFile(file.filePath);
    throw error;
  }

  return id;
}

export async function listDocuments(): Promise<Document[]> {
  return getDb().getAllAsync<Document>(
    "SELECT * FROM documents ORDER BY rowid DESC",
  );
}

export async function getDocumentById(id: string): Promise<Document | null> {
  return getDb().getFirstAsync<Document>(
    "SELECT * FROM documents WHERE id = ?",
    [id],
  );
}

export async function deleteDocumentById(id: string): Promise<void> {
  const doc = await getDocumentById(id);
  if (!doc) return;

  await getDb().runAsync("DELETE FROM documents WHERE id = ?", [id]);

  try {
    await deleteVaultFile(doc.file_path);
  } catch (error) {
    console.error("Registro apagado, mas o PDF ficou no disco:", error);
  }
}
