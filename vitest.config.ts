import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.test.ts"],
    setupFiles: ["test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        statements: 78,
        branches: 67,
        functions: 80,
        lines: 80,
      },
    },
    server: {
      deps: {},
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
});
