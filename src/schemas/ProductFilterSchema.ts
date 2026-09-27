import { z } from "zod";

export const productFilterSchema = z.object({
  minPrice: z
    .string()
    .optional()
    .refine(
      (value) => value === undefined || value === "" || Number(value) >= 0,
      {
        message: "Preço mínimo inválido",
      },
    ),

  maxPrice: z
    .string()
    .optional()
    .refine(
      (value) => value === undefined || value === "" || Number(value) >= 0,
      {
        message: "Preço máximo inválido",
      },
    ),
});

export type ProductFilterFormData = z.infer<typeof productFilterSchema>;
