import { z } from 'zod';

export const starWarsPersonApiSchema = z.object({
  message: z.string(),
  result: z.object({
    properties: z.object({
      height: z.string(),
      mass: z.string(),
      hair_color: z.string(),
      skin_color: z.string(),
      eye_color: z.string(),
      birth_year: z.string(),
      gender: z.string(),
      created: z.string(),
      edited: z.string(),
      name: z.string(),
      homeworld: z.string(),
      url: z.string(),
    }),
    description: z.string(),
    uid: z.string(),
  }),
});

export type StarWarsPersonApi = z.infer<typeof starWarsPersonApiSchema>;
