import sharp from "sharp";
import { readdir } from "node:fs/promises";
import { basename, join } from "node:path";

const source = new URL("../assets/project-artwork/", import.meta.url);
const output = new URL("../public/images/", import.meta.url);
const files = await readdir(source);

for (const file of files.filter((name) => name.endsWith(".svg"))) {
  const name = basename(file, ".svg");
  const coverOverride = `${name}.cover.webp`;
  const hasCoverOverride = files.includes(coverOverride);
  const image = sharp(
    join(source.pathname, hasCoverOverride ? coverOverride : file),
  );
  if (hasCoverOverride)
    image.resize(1200, 800, { fit: "cover" }).webp({ quality: 84, effort: 6 });
  else image.webp({ quality: 88 });
  await image.toFile(join(output.pathname, `${name}.webp`));
}

if (files.includes("trackflow.cover.webp"))
  await sharp(join(source.pathname, "trackflow.cover.webp"))
    .resize(1200, 800, { fit: "cover" })
    .webp({ quality: 84, effort: 6 })
    .toFile(join(output.pathname, "trackflow.webp"));

console.log(
  `Generated ${files.filter((name) => name.endsWith(".svg")).length} original project illustrations${files.includes("trackflow.cover.webp") ? " and refreshed the TrackFlow cover" : ""}.`,
);
