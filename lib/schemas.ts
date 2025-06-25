import * as z from "zod"

export const searchFormSchema = z.object({
  query: z
    .string()
    .min(2, "La recherche doit contenir au moins 2 caractères")
    .max(50, "La recherche ne peut pas dépasser 50 caractères")
    .transform(value => value.trim())
})

export type SearchFormValues = z.infer<typeof searchFormSchema> 