import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { Board } from "./schema/board";
import { Preferences } from "./schema/preferences";

export function yoursDir(): string {
  return process.env.SIFT_YOURS_DIR ?? join(process.cwd(), "yours");
}

export function readBoard(): Board {
  const path = join(yoursDir(), "board.json");
  if (!existsSync(path)) return { role: "", generatedAt: "", entries: [] };
  return Board.parse(JSON.parse(readFileSync(path, "utf8")));
}

export function writeBoard(board: Board): void {
  const dir = yoursDir();
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "board.json"), JSON.stringify(Board.parse(board), null, 2));
}

export function readYours(): { role: string; voice: string; preferences: Preferences } {
  const dir = yoursDir();
  const read = (f: string) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), "utf8") : "");
  const prefsRaw = read("preferences.json");
  return {
    role: read("role.md"),
    voice: read("voice.md"),
    preferences: Preferences.parse(prefsRaw ? JSON.parse(prefsRaw) : {}),
  };
}
