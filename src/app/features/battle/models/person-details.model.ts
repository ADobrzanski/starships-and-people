import { z } from 'zod';

export const personDetailsSchema = z.object({
  height: z.string(),
  mass: z.string(),
  hair_color: z.string(),
  skin_color: z.string(),
  eye_color: z.string(),
  birth_year: z.string(),
  gender: z.string(),
  name: z.string(),
});

export const isPersonDetails = (
  personDetails: unknown,
): personDetails is PersonDetails => {
  return personDetailsSchema.safeParse(personDetails).success;
};

export type PersonDetails = z.infer<typeof personDetailsSchema>;
