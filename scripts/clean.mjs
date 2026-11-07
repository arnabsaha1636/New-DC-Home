import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
// Only fixed generated directories within this project's root are removed.
for (const name of ["dist/", "test-results/", "playwright-report/"]) {
  const directory = new URL("../" + name, import.meta.url);
  rmSync(fileURLToPath(directory), { recursive: true, force: true });
}
