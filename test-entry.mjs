// TDD-lite test for the entry program (see makefun_bounty_workflow skill).
// Checks, per the kit gate: entry.txt is UTF-8 text of 1-200 chars, not only
// whitespace; the run is deterministic; main.ts imports stdlib only.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const main = join(dir, "main.ts");

function runOnce() {
  const out = mkdtempSync(join(tmpdir(), "excuse-entry-"));
  try {
    execFileSync(process.execPath, [main], {
      env: { ...process.env, MAKEFUN_OUTPUT_DIR: out },
      stdio: "pipe",
    });
    return readFileSync(join(out, "entry.txt"), "utf8");
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
}

// The exact judged line. The test pins it character-for-character so no
// later edit can silently change the entry that goes before the judge.
const EXPECTED =
  "I spent your entire token budget drafting the perfect apology for missing the deadline, and honestly, it is the best work I have done all week.";

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

// 1. Gate: 1-200 characters, not only whitespace.
const text = runOnce();
check("entry exists and is non-empty", text.length >= 1);
check("entry is at most 200 characters", text.length <= 200, `${text.length} chars`);
check("entry is not only whitespace", text.trim().length > 0);
check("entry is a single line", !text.includes("\n"));
check("entry matches the judged line exactly", text === EXPECTED);
check("entry has no leading/trailing whitespace", text === text.trim());

// 2. Determinism: same input -> same output.
const again = runOnce();
check("deterministic across runs", text === again);

// 3. Stdlib-only: main.ts imports only node: modules.
const src = readFileSync(main, "utf8");
const imports = [...src.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]);
const nonStd = imports.filter((i) => !i.startsWith("node:"));
check("stdlib-only imports", nonStd.length === 0, imports.join(", ") || "none");

// 4. No trailing newline inflating the count (file is exactly the line).
check("no trailing newline", !text.endsWith("\n"));

if (failures > 0) {
  console.error(`${failures} check(s) failed`);
  process.exit(1);
}
console.log("All checks passed.");
console.log(`Entry (${text.length} chars): ${text}`);
