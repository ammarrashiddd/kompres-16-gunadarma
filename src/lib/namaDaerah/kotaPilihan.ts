import { readFile } from "node:fs/promises";
import path from "node:path";

export interface KotaPilihan {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

const csvPath = path.join(
  process.cwd(),
  "src",
  "lib",
  "namaDaerah",
  "daftar-nama-daerah.csv",
);

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      fields.push(field);
      field = "";
    } else {
      field += character;
    }
  }

  fields.push(field);
  return fields;
}

export async function getKotaPilihan(): Promise<readonly KotaPilihan[]> {
  const csv = await readFile(csvPath, "utf8");

  return csv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map(parseCsvLine)
    .filter((fields) => fields[4] === "2")
    .map((fields) => ({
      id: fields[0],
      name: fields[2],
      latitude: Number(fields[5]),
      longitude: Number(fields[6]),
    }))
    .filter(
      (kota) =>
        kota.id.length > 0 &&
        kota.name.length > 0 &&
        Number.isFinite(kota.latitude) &&
        Number.isFinite(kota.longitude),
    );
}

export async function findKotaPilihan(
  name: unknown,
): Promise<KotaPilihan | undefined> {
  const kotaPilihan = await getKotaPilihan();
  return kotaPilihan.find((kota) => kota.name === name);
}
