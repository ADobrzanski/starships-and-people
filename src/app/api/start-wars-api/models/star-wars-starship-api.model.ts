import { z } from 'zod';

export const starWarsStarshipApiSchema = z.object({
  message: z.string(),
  result: z.object({
    properties: z.object({
      model: z.string(),
      starship_class: z.string(),
      manufacturer: z.string(),
      cost_in_credits: z.string(),
      length: z.string(),
      crew: z.string(),
      passengers: z.string(),
      max_atmosphering_speed: z.string(),
      hyperdrive_rating: z.string(),
      MGLT: z.string(),
      cargo_capacity: z.string(),
      consumables: z.string(),
      pilots: z.array(z.string()),
      created: z.string(),
      edited: z.string(),
      name: z.string(),
      url: z.string(),
    }),
    description: z.string(),
    uid: z.string(),
  }),
});

export type StarWarsStarshipApi = z.infer<typeof starWarsStarshipApiSchema>;
