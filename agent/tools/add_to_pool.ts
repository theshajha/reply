import { defineTool } from "eve/tools";
import { z } from "zod";
import { Bucket } from "@/lib/schema/board";
import { readPool, writePool, upsertPerson } from "@/lib/pool";

const Input = z.object({
  name: z.string(),
  contact: z.string(),
  role: z.string(),
  verdict: Bucket,
  keep: z.boolean().default(false),
  keepFor: z.string().default(""),
  links: z.array(z.string().url()).default([]),
});

export async function addToPool(input: z.input<typeof Input>): Promise<{ size: number }> {
  const sighting = Input.parse(input);
  const pool = upsertPerson(readPool(), sighting, new Date().toISOString());
  writePool(pool);
  return { size: pool.people.length };
}

export default defineTool({
  description: "Add or update one person in the durable pool (yours/pool.json), keyed by their email so the same person across roles and hiring rounds stays one entry. Use it for every applicant so nobody good is lost. Set keep=true and a short keepFor note for anyone worth remembering for a future or different role.",
  inputSchema: Input,
  execute: addToPool,
});
