import { randomUUID } from "expo-crypto";
import type { Document } from "./documents";
import { getDb } from "./database";

export type Folder = {
  id: string;
  name: string;
  documentCount: number;
};

export async function createFolder(
  name: string,
  documentIds: string[] = [],
): Promise<string> {
  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new Error("O nome da pasta é obrigatório.");
  }

  const id = randomUUID();
  const db = getDb();
  const uniqueDocumentIds = [...new Set(documentIds)];

  await db.withTransactionAsync(async () => {
    await db.runAsync("INSERT INTO folders (id, name) VALUES (?, ?)", [
      id,
      normalizedName,
    ]);

    for (const documentId of uniqueDocumentIds) {
      const result = await db.runAsync(
        "UPDATE documents SET folder_id = ? WHERE id = ? AND folder_id IS NULL",
        [id, documentId],
      );

      if (result.changes !== 1) {
        throw new Error(
          "Um ou mais documentos selecionados já pertencem a uma pasta.",
        );
      }
    }
  });

  return id;
}

export async function listUnfiledDocuments(): Promise<Document[]> {
  return getDb().getAllAsync<Document>(
    `SELECT *
     FROM documents
     WHERE folder_id IS NULL
     ORDER BY name COLLATE NOCASE ASC`,
  );
}

export async function listDocumentsInFolder(
  folderId: string,
): Promise<Document[]> {
  return getDb().getAllAsync<Document>(
    `SELECT *
     FROM documents
     WHERE folder_id = ?
     ORDER BY name COLLATE NOCASE ASC`,
    [folderId],
  );
}

export async function addDocumentsToFolder(
  folderId: string,
  documentIds: string[],
): Promise<void> {
  const uniqueDocumentIds = [...new Set(documentIds)];
  if (uniqueDocumentIds.length === 0) return;

  const db = getDb();

  await db.withTransactionAsync(async () => {
    const folder = await db.getFirstAsync<{ id: string }>(
      "SELECT id FROM folders WHERE id = ?",
      [folderId],
    );

    if (!folder) {
      throw new Error("Pasta não encontrada.");
    }

    for (const documentId of uniqueDocumentIds) {
      const result = await db.runAsync(
        "UPDATE documents SET folder_id = ? WHERE id = ? AND folder_id IS NULL",
        [folderId, documentId],
      );

      if (result.changes !== 1) {
        throw new Error(
          "Um ou mais documentos selecionados não estão mais disponíveis para adicionar.",
        );
      }
    }
  });
}

export async function listFolders(): Promise<Folder[]> {
  return getDb().getAllAsync<Folder>(
    `SELECT folders.id, folders.name, COUNT(documents.id) AS documentCount
     FROM folders
     LEFT JOIN documents ON documents.folder_id = folders.id
     GROUP BY folders.id
     ORDER BY folders.name COLLATE NOCASE ASC`,
  );
}

export async function getFolderById(id: string): Promise<Folder | null> {
  return getDb().getFirstAsync<Folder>(
    `SELECT folders.id, folders.name, COUNT(documents.id) AS documentCount
     FROM folders
     LEFT JOIN documents ON documents.folder_id = folders.id
     WHERE folders.id = ?
     GROUP BY folders.id`,
    [id],
  );
}

export async function deleteFolderById(id: string): Promise<void> {
  const db = getDb();

  await db.withTransactionAsync(async () => {
    const result = await db.getFirstAsync<{ total: number }>(
      "SELECT COUNT(*) AS total FROM documents WHERE folder_id = ?",
      [id],
    );

    if ((result?.total ?? 0) > 0) {
      throw new Error(
        "Não é possível excluir uma pasta que contém documentos.",
      );
    }

    await db.runAsync("DELETE FROM folders WHERE id = ?", [id]);
  });
}
