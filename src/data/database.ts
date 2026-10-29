import * as SQLite from "expo-sqlite";

const DB_NAME = "cofre.db";

const MIGRATIONS: string[] = [
  // Migration 1: estrutura original
  `CREATE TABLE documents (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL
      CHECK (category IN ('pessoais','familia','comprovantes','veiculos','outros')),
    document_number TEXT,
    expires_at TEXT,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL
  )`,

  // Migration 2: pastas e associação com documentos
  `CREATE TABLE folders (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL
  );

  ALTER TABLE documents
  ADD COLUMN folder_id TEXT
  REFERENCES folders(id) ON DELETE RESTRICT;

  CREATE INDEX idx_documents_folder_id
  ON documents(folder_id);`,
];

// Guarda a instância do banco para o resto do app usar
let dbInstance: SQLite.SQLiteDatabase | null = null;

export function getDb() {
  if (!dbInstance) {
    throw new Error("Banco ainda não foi inicializado");
  }

  return dbInstance;
}

export async function initDatabase() {
  const db = await SQLite.openDatabaseAsync(DB_NAME);

  // Impede excluir uma pasta que ainda tenha documentos.
  await db.execAsync("PRAGMA foreign_keys = ON");

  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );

  const currentVersion = row?.user_version ?? 0;

  for (let i = currentVersion; i < MIGRATIONS.length; i++) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(MIGRATIONS[i]);
      await db.execAsync(`PRAGMA user_version = ${i + 1}`);
    });
  }

  dbInstance = db;

  return db;
}
