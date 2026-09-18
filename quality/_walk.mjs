// Tiny recursive file walker (no deps).
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export function walk(dir, match) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full, match));
    else if (match(full)) out.push(full);
  }
  return out;
}
