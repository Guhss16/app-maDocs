export const CATEGORIES = {
  pessoais: { label: "Pessoais", color: "#4F46E5" },
  familia: { label: "Família", color: "#DB2777" },
  comprovantes: { label: "Comprovantes", color: "#059669" },
  veiculos: { label: "Veículos", color: "#D97706" },
  outros: { label: "Outros", color: "#6B7280" },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
