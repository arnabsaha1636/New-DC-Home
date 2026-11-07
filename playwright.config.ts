import { defineConfig } from "@playwright/test";
const basePath =
  process.env.PLAYWRIGHT_BASE_PATH === "/New-DC-Home/" ? "/New-DC-Home/" : "/";
const port =
  Number(process.env.PLAYWRIGHT_PORT) || (basePath === "/" ? 4173 : 4175);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error("Invalid preview port");
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  use: {
    baseURL: `http://127.0.0.1:${port}${basePath}`,
    viewport: { width: 1440, height: 1000 },
    launchOptions: process.env.PLAYWRIGHT_CHANNEL
      ? { channel: process.env.PLAYWRIGHT_CHANNEL }
      : {},
  },
  webServer: {
    command: `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port ${port} --base=${basePath} --strictPort`,
    url: `http://127.0.0.1:${port}${basePath}`,
    reuseExistingServer: !process.env.CI,
  },
});
