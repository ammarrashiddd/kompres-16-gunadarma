"use client";

import {
  ArrowRight,
  CheckCircle,
  FirstAidKit,
  MapPin,
  ShieldWarning,
  Siren,
  Spinner,
  Warning,
} from "@phosphor-icons/react";
import { type FormEvent, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import {
  type EvacuationGuidance,
  type EvacuationRequest,
  fetchEvacuationGuidance,
  type UserSituation,
} from "@/lib/api";

const situations: Array<{ value: UserSituation; label: string }> = [
  { value: "indoor", label: "Di dalam bangunan" },
  { value: "highrise", label: "Di gedung bertingkat" },
  { value: "outdoor", label: "Di luar ruangan" },
  { value: "coastal", label: "Di wilayah pesisir" },
  { value: "driving", label: "Sedang berkendara" },
];

const specialOptions = [
  { value: "ada_lansia", label: "Ada lansia" },
  { value: "ada_disabilitas", label: "Ada penyandang disabilitas" },
  { value: "ada_bayi", label: "Ada bayi" },
];

const urgencyStyles: Record<EvacuationGuidance["urgencyLevel"], string> = {
  DARURAT: "border-red-200 bg-red-50 text-red-800",
  WASPADA: "border-amber-200 bg-amber-50 text-amber-800",
  SIAGA: "border-sky-200 bg-sky-50 text-sky-800",
  AMAN: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-[#e5e3df] bg-[#fbfaf9] px-3.5 py-3 text-sm text-[#202123] outline-none transition focus:border-[#c85b31] focus:bg-white focus:ring-2 focus:ring-[#c85b31]/10";

function GuidanceList({
  title,
  items,
  marker,
}: {
  title: string;
  items: string[];
  marker: "check" | "number";
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-[#202123]">{title}</h3>
      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li
            className="flex items-start gap-3 rounded-xl bg-[#fbfaf9] px-3.5 py-3 text-sm leading-6 text-[#55524e]"
            key={`${index}-${item}`}
          >
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#f1e5df] text-[10px] font-bold text-[#a44b29]">
              {marker === "check" ? (
                <CheckCircle size={14} weight="fill" />
              ) : (
                index + 1
              )}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function EvacuationAssistantPage() {
  const [magnitude, setMagnitude] = useState("5.0");
  const [depthKm, setDepthKm] = useState("10");
  const [distanceKm, setDistanceKm] = useState("30");
  const [locationName, setLocationName] = useState("");
  const [userSituation, setUserSituation] = useState<UserSituation>("indoor");
  const [specialConditions, setSpecialConditions] = useState<string[]>([]);
  const [guidance, setGuidance] = useState<EvacuationGuidance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleSpecialCondition(value: string) {
    setSpecialConditions((current) =>
      current.includes(value)
        ? current.filter((condition) => condition !== value)
        : [...current, value],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setGuidance(null);
    setLoading(true);

    const request: EvacuationRequest = {
      magnitude: Number(magnitude),
      depthKm: Number(depthKm),
      distanceKm: Number(distanceKm),
      locationName: locationName.trim() || undefined,
      userSituation,
      specialConditions,
    };

    try {
      const result = await fetchEvacuationGuidance(request);
      setGuidance(result.data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Panduan evakuasi gagal dimuat. Coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#e9e7e5] px-3 py-3 text-[#202123] md:px-6 md:py-6 lg:px-8">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-360 rounded-[30px] bg-[#f7f7f5] p-4 shadow-[0_24px_70px_rgba(48,43,38,0.12)] md:min-h-[calc(100vh-3rem)] md:p-6 lg:p-8">
        <nav className="mb-7">
          <Navbar />
        </nav>

        <section className="mb-7 px-1 md:px-2">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-[#c85b31]">
            Panduan kesiapsiagaan
          </p>
          <h1 className="text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-[-0.07em] text-[#202123]">
            Asisten evakuasi
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777572]">
            Masukkan situasi dan kondisi gempa untuk mendapatkan langkah
            keselamatan yang relevan. Jika sedang dalam bahaya, segera ikuti
            petugas di lokasi dan hubungi layanan darurat.
          </p>
        </section>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)]">
          <section className="rounded-2xl border border-[#e5e3df] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-[#f0efed] pb-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#f1e5df] text-[#c85b31]">
                <Siren size={21} weight="fill" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#202123]">
                  Kondisi saat ini
                </h2>
                <p className="mt-0.5 text-xs text-[#88847e]">
                  Sesuaikan dengan informasi yang kamu ketahui
                </p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  className="text-xs font-semibold text-[#4b4a47]"
                  htmlFor="situation"
                >
                  Posisi kamu
                </label>
                <select
                  className={fieldClass}
                  id="situation"
                  onChange={(event) =>
                    setUserSituation(event.target.value as UserSituation)
                  }
                  value={userSituation}
                >
                  {situations.map((situation) => (
                    <option key={situation.value} value={situation.value}>
                      {situation.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="text-xs font-semibold text-[#4b4a47]"
                  htmlFor="location"
                >
                  Lokasi kamu{" "}
                  <span className="font-normal text-[#99958f]">(opsional)</span>
                </label>
                <div className="relative">
                  <MapPin
                    aria-hidden="true"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99958f]"
                    size={17}
                  />
                  <input
                    className={`${fieldClass} pl-10`}
                    id="location"
                    maxLength={150}
                    onChange={(event) => setLocationName(event.target.value)}
                    placeholder="Contoh: Padang, Sumatera Barat"
                    value={locationName}
                  />
                </div>
              </div>

              <fieldset>
                <legend className="text-xs font-semibold text-[#4b4a47]">
                  Data gempa
                </legend>
                <div className="mt-1.5 grid grid-cols-3 gap-2.5">
                  <label className="min-w-0 text-[11px] font-medium text-[#777572]">
                    Magnitudo
                    <input
                      className={fieldClass}
                      max="10"
                      min="0"
                      onChange={(event) => setMagnitude(event.target.value)}
                      required
                      step="0.1"
                      type="number"
                      value={magnitude}
                    />
                  </label>
                  <label className="min-w-0 text-[11px] font-medium text-[#777572]">
                    Kedalaman (km)
                    <input
                      className={fieldClass}
                      max="700"
                      min="0"
                      onChange={(event) => setDepthKm(event.target.value)}
                      required
                      step="any"
                      type="number"
                      value={depthKm}
                    />
                  </label>
                  <label className="min-w-0 text-[11px] font-medium text-[#777572]">
                    Jarak (km)
                    <input
                      className={fieldClass}
                      max="20000"
                      min="0"
                      onChange={(event) => setDistanceKm(event.target.value)}
                      required
                      step="any"
                      type="number"
                      value={distanceKm}
                    />
                  </label>
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-xs font-semibold text-[#4b4a47]">
                  Kondisi khusus di rombongan
                </legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  {specialOptions.map((option) => (
                    <label
                      className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[#eeece8] px-3 py-2.5 text-xs text-[#5f5c57] transition hover:bg-[#fbfaf9]"
                      key={option.value}
                    >
                      <input
                        checked={specialConditions.includes(option.value)}
                        className="size-4 accent-[#c85b31]"
                        onChange={() => toggleSpecialCondition(option.value)}
                        type="checkbox"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {error && (
                <p
                  className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs leading-5 text-red-700"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#202123] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#38393a] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <Spinner className="animate-spin" size={17} />
                ) : (
                  <ArrowRight size={17} weight="bold" />
                )}
                {loading
                  ? "Menyiapkan panduan..."
                  : "Dapatkan panduan evakuasi"}
              </button>
            </form>
          </section>

          <section
            aria-live="polite"
            className="min-h-[420px] rounded-2xl border border-[#e5e3df] bg-white p-5 shadow-sm md:p-6"
          >
            {loading ? (
              <div className="flex min-h-[370px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#f1e5df] text-[#c85b31]">
                  <Spinner className="animate-spin" size={27} />
                </div>
                <h2 className="text-base font-semibold text-[#202123]">
                  Menyiapkan panduan
                </h2>
                <p className="mt-1 max-w-sm text-sm leading-6 text-[#777572]">
                  Sedang menyusun langkah berdasarkan situasi dan informasi
                  gempa yang kamu masukkan.
                </p>
              </div>
            ) : !guidance ? (
              <div className="flex min-h-[370px] flex-col items-center justify-center px-3 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#f1e5df] text-[#c85b31]">
                  <ShieldWarning size={27} weight="fill" />
                </div>
                <h2 className="text-base font-semibold text-[#202123]">
                  Panduan akan tampil di sini
                </h2>
                <p className="mt-1 max-w-sm text-sm leading-6 text-[#777572]">
                  Isi situasi saat ini lalu minta panduan untuk melihat tindakan
                  segera, potensi bahaya, dan kontak darurat.
                </p>
                <div className="mt-5 flex max-w-md items-start gap-2 rounded-xl bg-[#f5f1eb] px-4 py-3 text-left text-xs leading-5 text-[#777572]">
                  <Warning
                    className="mt-0.5 shrink-0 text-[#a66c25]"
                    size={16}
                  />
                  Saat gempa berlangsung, lakukan perlindungan diri terlebih
                  dahulu. Jangan menunggu respons aplikasi.
                </div>
              </div>
            ) : (
              <div>
                <div
                  className={`mb-5 rounded-2xl border p-4 ${
                    urgencyStyles[guidance.urgencyLevel]
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em]">
                      Tingkat kewaspadaan
                    </p>
                    <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold">
                      {guidance.urgencyLevel}
                    </span>
                  </div>
                  <h2 className="mt-2 text-base font-bold leading-6">
                    {guidance.headline}
                  </h2>
                </div>

                {guidance.urgencyLevel === "DARURAT" && (
                  <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-800">
                    <Warning
                      className="mt-0.5 shrink-0"
                      size={17}
                      weight="fill"
                    />
                    Prioritaskan keselamatan fisik. Ikuti instruksi petugas
                    darurat dan menjauh dari bangunan yang rusak.
                  </div>
                )}

                <div className="space-y-6">
                  <GuidanceList
                    items={guidance.immediateActions}
                    marker="check"
                    title="Yang perlu dilakukan sekarang"
                  />
                  <GuidanceList
                    items={guidance.hazardWarnings}
                    marker="number"
                    title="Bahaya yang perlu dihindari"
                  />
                  <GuidanceList
                    items={guidance.itemsToBring}
                    marker="number"
                    title="Barang yang bisa dibawa jika aman"
                  />

                  <section className="rounded-xl border border-[#e8e0d6] bg-[#f5f1eb] p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <MapPin className="text-[#a44b29]" size={17} />
                      <h3 className="text-sm font-semibold text-[#202123]">
                        Arah evakuasi
                      </h3>
                    </div>
                    <p className="text-sm leading-6 text-[#55524e]">
                      {guidance.evacuationDirection}
                    </p>
                  </section>

                  {guidance.emergencyContacts.length > 0 && (
                    <section>
                      <div className="mb-3 flex items-center gap-2">
                        <FirstAidKit
                          className="text-[#c85b31]"
                          size={18}
                          weight="fill"
                        />
                        <h3 className="text-sm font-semibold text-[#202123]">
                          Kontak darurat
                        </h3>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {guidance.emergencyContacts.map((contact) => (
                          <a
                            className="rounded-xl border border-[#eeece8] p-3 transition hover:border-[#d7c1b5] hover:bg-[#fbfaf9]"
                            href={`tel:${contact.number}`}
                            key={`${contact.name}-${contact.number}`}
                          >
                            <span className="text-xs font-semibold text-[#4b4a47]">
                              {contact.name}
                            </span>
                            <span className="mt-1 block text-lg font-bold tracking-wide text-[#a44b29]">
                              {contact.number}
                            </span>
                            <span className="mt-0.5 block text-[10px] leading-4 text-[#88847e]">
                              {contact.description}
                            </span>
                          </a>
                        ))}
                      </div>
                    </section>
                  )}

                  <p className="border-t border-[#f0efed] pt-4 text-[11px] leading-5 text-[#777572]">
                    {guidance.disclaimer}
                  </p>
                  {guidance.source === "protocol_fallback" && (
                    <p className="rounded-lg bg-[#f6f5f3] px-3 py-2 text-[10px] leading-4 text-[#88847e]">
                      Panduan ditampilkan berdasarkan protokol keselamatan
                      cadangan.
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-xl border border-[#e8e0d6] bg-[#f5f1eb] px-4 py-3 text-xs leading-5 text-[#777572]">
          <ShieldWarning className="mt-0.5 shrink-0 text-[#a66c25]" size={16} />
          Panduan ini hanya sebagai bantuan kesiapsiagaan, bukan pengganti
          informasi resmi. Ikuti selalu arahan BPBD/BNPB dan petugas setempat.
        </div>
      </div>
    </main>
  );
}
