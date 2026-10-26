// Runs after `next build` (npm "postbuild").
//
// With `output: "export"`, Next.js 16 writes route prefetch data for nested segments into
// folders, such as out/topics/bfs/__next.topics/$d$id/__PAGE__.txt, but the browser asks for
// the same file with the parts joined by dots: /topics/bfs/__next.topics.$d$id.__PAGE__.txt.
// On a static host those requests 404, so every link prefetch fails. This writes a dot-joined
// copy next to each nested file. Remove this script once Next.js writes the files itself.

import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
if (!existsSync(OUT)) process.exit(0);

let copied = 0;

function filesUnder(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? filesUnder(p) : [p];
  });
}

function visit(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const file of filesUnder(p)) {
        const flat = join(dir, [name, ...relative(p, file).split(sep)].join("."));
        if (!existsSync(flat)) {
          copyFileSync(file, flat);
          copied++;
        }
      }
    } else if (name !== "_next") {
      visit(p);
    }
  }
}

visit(OUT);
console.log(`flatten-prefetch: wrote ${copied} prefetch file(s).`);
