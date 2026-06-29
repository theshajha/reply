import { z } from "zod";
import { Bucket } from "./board";

// One person in the durable pool. Keyed by personId (a hash of their email), so the
// same human is a single entry across every role and hiring round. This is what lets a
// strong applicant resurface later instead of getting lost.
export const PoolPerson = z.object({
  id: z.string(),
  name: z.string(),
  contact: z.string(),
  roles: z.array(z.string()).default([]),
  lastVerdict: Bucket,
  keep: z.boolean().default(false),
  keepFor: z.string().default(""),
  links: z.array(z.string().url()).default([]),
  firstSeen: z.string(),
  lastSeen: z.string(),
});
export type PoolPerson = z.infer<typeof PoolPerson>;

export const Pool = z.object({
  people: z.array(PoolPerson).default([]),
});
export type Pool = z.infer<typeof Pool>;
