import { z } from 'zod';

export const starWarsPeopleApiSchema = z.object({
  message: z.string(),
  total_records: z.number(),
  total_pages: z.number(),
  previous: z.string().nullable(),
  next: z.string().nullable(),
  results: z.array(
    z.object({ uid: z.string(), name: z.string(), url: z.string() }),
  ),
});

export type StarWarsPeopleApi = z.infer<typeof starWarsPeopleApiSchema>;
