import badge from "badge-up";
import fs from "fs/promises";

export default async ({ minSize, gzipSize }) => {
  const sizeBadge = await badge.v2([
    "Size",
    [`${minSize} (min)`, "orange"],
    [`${gzipSize} (min + gzip)`, "green"],
  ]);
  await fs.writeFile("docs/size-badge.svg", sizeBadge);
};
