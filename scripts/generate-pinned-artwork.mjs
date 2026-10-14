import sharp from "sharp";
import { readdir } from "node:fs/promises";
import { basename, join } from "node:path";

const source = new URL("../assets/project-artwork/", import.meta.url);
const output = new URL("../public/images/", import.meta.url);
const files = await readdir(source);

for (const file of files.filter((name) => name.endsWith(".svg"))) {
  const name = basename(file, ".svg");
  await sharp(join(source.pathname, file))
    .webp({ quality: 88 })
    .toFile(join(output.pathname, `${name}.webp`));
}

console.log(
  `Generated ${files.filter((name) => name.endsWith(".svg")).length} original project illustrations.`,
);
