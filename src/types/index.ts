export interface GempaData {
  Tanggal: string;
  Jam: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi: string;
  Dirasakan?: string;
  Coordinates: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
}
