import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),

  description: z.string().optional(),

  price: z
    .string()
    .min(1, "O preço é obrigatório.")
    .refine(
      (value) => {
        const price = Number(value);

        return Number.isFinite(price) && price > 0;
      },
      {
        message: "Informe um preço válido.",
      },
    ),

  stock: z
    .string()
    .min(1, "O estoque é obrigatório.")
    .refine(
      (value) => {
        const stock = Number(value);

        return Number.isInteger(stock) && stock >= 0;
      },
      {
        message: "Informe um estoque válido.",
      },
    ),

  sku: z.string().min(1, "O SKU é obrigatório."),

  categoryId: z.string().min(1, "A categoria é obrigatória."),
});

export type ProductFormData = z.infer<typeof productSchema>;
