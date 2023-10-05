import { z } from 'zod';

export const starshipDetailsSchema = z.object({
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
  name: z.string(),
});

export const isStarshipDetails = (x: unknown): x is StarshipDetails => {
  return starshipDetailsSchema.safeParse(x).success;
};

export type StarshipDetails = z.infer<typeof starshipDetailsSchema>;
