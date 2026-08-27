import { existsSync, renameSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const workerOutput = fileURLToPath(new URL('./dist/gift_reveal', import.meta.url));
const serverOutput = fileURLToPath(new URL('./dist/server', import.meta.url));

if (!existsSync(workerOutput)) {
  throw new Error('Không tìm thấy bản build của Worker.');
}

renameSync(workerOutput, serverOutput);
