import { defineConfig } from 'vite';
import { sites } from '@openai/sites-vite-plugin';

const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === 'seatbelt';

export default defineConfig(async () => {
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';

  const { cloudflare } = await import('@cloudflare/vite-plugin');

  return {
    server: {
      port: 3000,
      ...(isCodexSeatbeltSandbox
        ? { watch: { useFsEvents: false, usePolling: true } }
        : {}),
    },
    plugins: [
      sites(),
      cloudflare({
        config: {
          main: 'worker.js',
          compatibility_date: '2026-05-22',
          assets: {
            binding: 'ASSETS',
            not_found_handling: 'single-page-application',
          },
        },
      }),
    ],
  };
});
