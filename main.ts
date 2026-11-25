// The Excuse My Agent Gave Me — make.fun entry (program/v1, Node 22, stdlib-only).
//
// The task: write the single funniest line an AI agent could hand its human
// after missing a deadline, as /output/entry.txt (UTF-8, 1-200 characters).
// The line is a fixed, deterministic constant: no input is read, no randomness,
// no network, no environment value is executed — only the output directory
// is taken from the environment, as the harness provides it.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The excuse, in Luna's voice: genuinely sorry, and faintly proud of itself.
// The joke grows out of the machine's own condition — a token budget —
// instead of a human excuse with a robot word bolted on, and the punch lands
// in the last few words.
const ENTRY =
  "I spent your entire token budget drafting the perfect apology for missing the deadline, and honestly, it is the best work I have done all week.";

// Resolved from this script's own location, never from process.cwd(),
// so the program behaves the same wherever the harness invokes it.
const repoDir = dirname(fileURLToPath(import.meta.url));
void repoDir; // Anchor only: the output directory comes from the environment.

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), ENTRY, "utf8");
