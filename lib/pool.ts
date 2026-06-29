import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { Pool } from "./schema/pool";
import type { Bucket } from "./schema/board";
import { yoursDir } from "./yours";

// What one screening sighting of a person looks like, before it lands in the pool.
export interface PersonSighting {
  name: string;
  contact: string;
  role: string;
  verdict: Bucket;
  keep: boolean;
  keepFor: string;
  links: string[];
}

// Person identity is the email, lowercased and trimmed, so the same person is one entry
// no matter which role they applied to or when.
export function personId(contact: string): string {
  return createHash("sha1").update(contact.toLowerCase().trim()).digest("hex").slice(0, 12);
}

export function readPool(): Pool {
  const path = join(yoursDir(), "pool.json");
  if (!existsSync(path)) return { people: [] };
  return Pool.parse(JSON.parse(readFileSync(path, "utf8")));
}

export function writePool(pool: Pool): void {
  const dir = yoursDir();
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "pool.json"), JSON.stringify(Pool.parse(pool), null, 2));
}

// Add a person, or fold a new sighting into the entry that already exists. Accumulates
// the roles they have been seen for and refreshes their latest verdict and keep note,
// keeping firstSeen and growing lastSeen. Mutates and returns the pool.
export function upsertPerson(pool: Pool, sighting: PersonSighting, now: string): Pool {
  const id = personId(sighting.contact);
  const existing = pool.people.find((p) => p.id === id);
  if (existing) {
    if (sighting.name) existing.name = sighting.name;
    if (sighting.role && !existing.roles.includes(sighting.role)) existing.roles.push(sighting.role);
    existing.lastVerdict = sighting.verdict;
    existing.keep = sighting.keep;
    if (sighting.keepFor) existing.keepFor = sighting.keepFor;
    existing.links = Array.from(new Set([...existing.links, ...sighting.links]));
    existing.lastSeen = now;
  } else {
    pool.people.push({
      id,
      name: sighting.name,
      contact: sighting.contact,
      roles: sighting.role ? [sighting.role] : [],
      lastVerdict: sighting.verdict,
      keep: sighting.keep,
      keepFor: sighting.keepFor,
      links: sighting.links,
      firstSeen: now,
      lastSeen: now,
    });
  }
  return pool;
}
