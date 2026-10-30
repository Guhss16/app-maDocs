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
  folder_id: string | null;
  folder_name?: string | null;
};

export type NewDocument = {
  name: string;
  category: CategoryKey;
  pdfUri: string;
  documentNumber?: string;
  expiresAt?: string;
  folderId?: string | null;
};

export async function createDocument(input: NewDocument) {
  const id = randomUUID();

  // 1. Copia o PDF para a pasta privada do app
  const file = await copyPdfToVault(input.pdfUri, id);

  try {
    // 2. Grava os metadados no banco
    await getDb().runAsync(
      `INSERT INTO documents
        (
          id,
          name,
          category,
          document_number,
          expires_at,
          file_path,
          file_size,
          folder_id
        )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.name,
        input.category,
        input.documentNumber ?? null,
        input.expiresAt ?? null,
        file.filePath,
        file.fileSize,
        input.folderId ?? null,
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
    `SELECT documents.*, folders.name AS folder_name
     FROM documents
     LEFT JOIN folders ON folders.id = documents.folder_id
     WHERE documents.id = ?`,
    [id],
  );
}

export async function updateDocumentById(
  id: string,
  input: {
    name: string;
    category: CategoryKey;
    documentNumber: string | null;
    folderId?: string | null;
  },
): Promise<void> {
  if (input.folderId === undefined) {
    await getDb().runAsync(
      `UPDATE documents
       SET name = ?, category = ?, document_number = ?
       WHERE id = ?`,
      [input.name, input.category, input.documentNumber, id],
    );
    return;
  }

  await getDb().runAsync(
    `UPDATE documents
     SET name = ?,
         category = ?,
         document_number = ?,
         folder_id = ?
     WHERE id = ?`,
    [
      input.name,
      input.category,
      input.documentNumber,
      input.folderId ?? null,
      id,
    ],
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

export async function countDocuments(): Promise<number> {
  const result = await getDb().getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) AS total FROM documents",
  );

  if (!result) {
    throw new Error("Não foi possível contar os documentos.");
  }

  return result.total;
}

export async function getTotalDocumentSize(): Promise<number> {
  const result = await getDb().getFirstAsync<{ totalBytes: number }>(
    "SELECT COALESCE(SUM(file_size), 0) AS totalBytes FROM documents",
  );

  if (!result) {
    throw new Error("Não foi possível calcular o espaço ocupado.");
  }

  return result.totalBytes;
}

export async function deleteAllDocumentsAndFolders(): Promise<void> {
  const db = getDb();
  const documents = await listDocuments();
  let failedFileDeletes = 0;

  for (const document of documents) {
    try {
      await deleteVaultFile(document.file_path);
    } catch (error) {
      failedFileDeletes++;
      console.error(`Erro ao apagar o PDF do documento ${document.id}:`, error);
    }
  }

  if (failedFileDeletes > 0) {
    throw new Error(
      `Não foi possível apagar ${failedFileDeletes} PDF(s). Os documentos e as pastas foram mantidos; tente novamente.`,
    );
  }

  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM documents");
    await db.runAsync("DELETE FROM folders");
  });
}
