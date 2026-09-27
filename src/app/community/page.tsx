"use client";

import {
  ArrowClockwise,
  Check,
  CheckCircle,
  MagnifyingGlass,
  MapPin,
  PencilSimple,
  Plus,
  ShieldWarning,
  Spinner,
  ThumbsUp,
  Trash,
  X,
} from "@phosphor-icons/react";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import {
  type CommunityPost,
  type CommunityPostInput,
  createCommunityPost,
  type DamageLevel,
  deleteCommunityPost,
  fetchCommunityPosts,
  updateCommunityPost,
  verifyCommunityPost,
} from "@/lib/api";

const damageLevels: DamageLevel[] = ["RINGAN", "SEDANG", "BERAT", "DARURAT"];

const damageStyles: Record<DamageLevel, string> = {
  RINGAN: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  SEDANG: "bg-amber-50 text-amber-700 ring-amber-200",
  BERAT: "bg-orange-50 text-orange-700 ring-orange-200",
  DARURAT: "bg-red-50 text-red-700 ring-red-200",
};

function getDamageLabel(level: DamageLevel) {
  return level.charAt(0) + level.slice(1).toLowerCase();
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Waktu tidak diketahui"
    : new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function getSafeImageUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

interface ReportFormProps {
  post?: CommunityPost;
  submitting: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (input: CommunityPostInput) => Promise<void>;
}

function ReportForm({
  post,
  submitting,
  error,
  onCancel,
  onSubmit,
}: ReportFormProps) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [locationName, setLocationName] = useState(post?.locationName ?? "");
  const [damageLevel, setDamageLevel] = useState<DamageLevel>(
    post?.damageLevel ?? "RINGAN",
  );
  const [imageUrl, setImageUrl] = useState(post?.imageUrl ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [latitude, setLatitude] = useState(
    post?.latitude === null || post?.latitude === undefined
      ? ""
      : String(post.latitude),
  );
  const [longitude, setLongitude] = useState(
    post?.longitude === null || post?.longitude === undefined
      ? ""
      : String(post.longitude),
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);
    if (imageUrl.trim()) {
      try {
        const image = new URL(imageUrl.trim());
        if (image.protocol !== "http:" && image.protocol !== "https:") {
          setValidationError("Gunakan tautan foto HTTP atau HTTPS.");
          return;
        }
      } catch {
        setValidationError("Masukkan tautan foto yang valid.");
        return;
      }
    }

    const input: CommunityPostInput = {
      title: title.trim(),
      description: description.trim(),
      locationName: locationName.trim(),
      damageLevel,
      imageUrl: imageUrl.trim() || null,
      ...(latitude.trim() ? { latitude: Number(latitude) } : {}),
      ...(longitude.trim() ? { longitude: Number(longitude) } : {}),
    };
    await onSubmit(input);
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-[#e5e3df] bg-white px-3.5 py-3 text-sm text-[#202123] outline-none transition focus:border-[#c85b31] focus:ring-2 focus:ring-[#c85b31]/10";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#202123]/45 p-3 backdrop-blur-sm"
      role="presentation"
    >
      <section
        aria-labelledby="report-form-title"
        aria-modal="true"
        className="my-auto w-full max-w-2xl rounded-[26px] bg-[#f7f7f5] p-5 shadow-[0_24px_70px_rgba(32,33,35,0.24)] sm:p-7"
        role="dialog"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c85b31]">
              Laporan warga
            </p>
            <h2
              className="mt-1 text-xl font-semibold tracking-tight text-[#202123]"
              id="report-form-title"
            >
              {post ? "Edit laporan" : "Bagikan kondisi sekitar"}
            </h2>
            <p className="mt-1 text-xs leading-5 text-[#777572]">
              Informasi yang jelas membantu warga dan petugas merespons lebih
              cepat.
            </p>
          </div>
          <button
            aria-label="Tutup form"
            className="rounded-full p-2 text-[#777572] transition hover:bg-[#eeece8] hover:text-[#202123] disabled:opacity-50"
            disabled={submitting}
            onClick={onCancel}
            type="button"
          >
            <X size={19} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {(error || validationError) && (
            <p
              className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs leading-5 text-red-700"
              role="alert"
            >
              {validationError ?? error}
            </p>
          )}
          <div>
            <label
              className="text-xs font-semibold text-[#4b4a47]"
              htmlFor="report-title"
            >
              Judul laporan
            </label>
            <input
              className={inputClass}
              id="report-title"
              maxLength={200}
              minLength={3}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Contoh: Dinding rumah retak setelah gempa"
              required
              value={title}
            />
          </div>

          <div>
            <label
              className="text-xs font-semibold text-[#4b4a47]"
              htmlFor="report-description"
            >
              Deskripsi kondisi
            </label>
            <textarea
              className={`${inputClass} min-h-28 resize-y`}
              id="report-description"
              maxLength={3000}
              minLength={5}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Jelaskan kerusakan atau kondisi yang terlihat."
              required
              value={description}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                className="text-xs font-semibold text-[#4b4a47]"
                htmlFor="report-location"
              >
                Lokasi
              </label>
              <input
                className={inputClass}
                id="report-location"
                maxLength={150}
                minLength={2}
                onChange={(event) => setLocationName(event.target.value)}
                placeholder="Nama jalan, area, atau kelurahan"
                required
                value={locationName}
              />
            </div>
            <div>
              <label
                className="text-xs font-semibold text-[#4b4a47]"
                htmlFor="report-damage"
              >
                Tingkat kerusakan
              </label>
              <select
                className={inputClass}
                id="report-damage"
                onChange={(event) =>
                  setDamageLevel(event.target.value as DamageLevel)
                }
                value={damageLevel}
              >
                {damageLevels.map((level) => (
                  <option key={level} value={level}>
                    {getDamageLabel(level)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              className="text-xs font-semibold text-[#4b4a47]"
              htmlFor="report-image"
            >
              Tautan foto{" "}
              <span className="font-normal text-[#99958f]">(opsional)</span>
            </label>
            <input
              className={inputClass}
              id="report-image"
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
              type="url"
              value={imageUrl}
            />
          </div>

          <details className="rounded-xl border border-[#e5e3df] bg-white/70 px-4 py-3">
            <summary className="cursor-pointer text-xs font-semibold text-[#6f6d69]">
              Tambahkan koordinat (opsional)
            </summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-medium text-[#6f6d69]">
                Latitude
                <input
                  className={inputClass}
                  max="90"
                  min="-90"
                  onChange={(event) => setLatitude(event.target.value)}
                  step="any"
                  type="number"
                  value={latitude}
                />
              </label>
              <label className="text-xs font-medium text-[#6f6d69]">
                Longitude
                <input
                  className={inputClass}
                  max="180"
                  min="-180"
                  onChange={(event) => setLongitude(event.target.value)}
                  step="any"
                  type="number"
                  value={longitude}
                />
              </label>
            </div>
          </details>

          <div className="flex flex-col-reverse gap-2 border-t border-[#e5e3df] pt-4 sm:flex-row sm:justify-end">
            <button
              className="rounded-xl px-4 py-3 text-sm font-semibold text-[#6f6d69] transition hover:bg-[#eeece8] disabled:opacity-50"
              disabled={submitting}
              onClick={onCancel}
              type="button"
            >
              Batal
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#202123] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#38393a] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting}
              type="submit"
            >
              {submitting ? (
                <Spinner className="animate-spin" size={17} />
              ) : (
                <Check size={17} weight="bold" />
              )}
              {post ? "Simpan perubahan" : "Terbitkan laporan"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [busyPostId, setBusyPostId] = useState<number | null>(null);
  const [activeSearch, setActiveSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeDamage, setActiveDamage] = useState<DamageLevel | "">("");
  const [damageInput, setDamageInput] = useState<DamageLevel | "">("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadPosts = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const result = await fetchCommunityPosts({
          search: activeSearch,
          damageLevel: activeDamage || undefined,
        });
        setPosts(result.data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal memuat laporan komunitas.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [activeDamage, activeSearch],
  );

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  function openCreateForm() {
    setEditingPost(null);
    setModalOpen(true);
    setError(null);
  }

  async function handleSave(input: CommunityPostInput) {
    setSubmitting(true);
    setError(null);
    try {
      if (editingPost) {
        await updateCommunityPost(editingPost.id, input);
        setNotice("Perubahan laporan berhasil disimpan.");
      } else {
        await createCommunityPost(input);
        setNotice("Laporan berhasil diterbitkan.");
      }
      setModalOpen(false);
      setEditingPost(null);
      await loadPosts(true);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Gagal menyimpan laporan.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(post: CommunityPost) {
    if (
      !window.confirm(
        `Hapus laporan "${post.title}"? Tindakan ini tidak dapat dibatalkan.`,
      )
    ) {
      return;
    }

    setBusyPostId(post.id);
    setError(null);
    try {
      const message = await deleteCommunityPost(post.id);
      setNotice(message);
      await loadPosts(true);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Gagal menghapus laporan.",
      );
    } finally {
      setBusyPostId(null);
    }
  }

  async function handleVerify(post: CommunityPost) {
    setBusyPostId(post.id);
    setError(null);
    try {
      const result = await verifyCommunityPost(post.id);
      setPosts((currentPosts) =>
        currentPosts.map((current) =>
          current.id === post.id
            ? { ...current, verifiedCount: result.data.verifiedCount }
            : current,
        ),
      );
      setNotice(result.message ?? "Laporan berhasil diverifikasi.");
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "Gagal memverifikasi laporan.",
      );
    } finally {
      setBusyPostId(null);
    }
  }

  function handleFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveSearch(searchInput.trim());
    setActiveDamage(damageInput);
    setNotice(null);
  }

  return (
    <main className="min-h-screen bg-[#e9e7e5] px-3 py-3 text-[#202123] md:px-6 md:py-6 lg:px-8">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-360 rounded-[30px] bg-[#f7f7f5] p-4 shadow-[0_24px_70px_rgba(48,43,38,0.12)] md:min-h-[calc(100vh-3rem)] md:p-6 lg:p-8">
        <nav className="mb-7">
          <Navbar />
        </nav>

        <section className="mb-7 flex flex-col justify-between gap-5 px-1 sm:flex-row sm:items-end md:px-2">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-[#c85b31]">
              Info dari warga
            </p>
            <h1 className="text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-[-0.07em] text-[#202123]">
              Komunitas tanggap bencana
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#777572]">
              Bagikan kondisi kerusakan di sekitarmu dan bantu warga lain
              mendapatkan informasi yang terverifikasi.
            </p>
          </div>
          <button
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#202123] px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(32,33,35,0.12)] transition hover:bg-[#38393a] active:scale-[0.98]"
            onClick={openCreateForm}
            type="button"
          >
            <Plus size={18} weight="bold" />
            Buat laporan
          </button>
        </section>

        <section className="mb-5 rounded-2xl border border-[#e5e3df] bg-white p-4 shadow-sm md:p-5">
          <form
            className="grid gap-3 md:grid-cols-[minmax(0,1fr)_190px_auto]"
            onSubmit={handleFilter}
          >
            <label className="relative block">
              <span className="sr-only">Cari laporan</span>
              <MagnifyingGlass
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99958f]"
                size={18}
              />
              <input
                className="w-full rounded-xl border border-[#e5e3df] bg-[#fbfaf9] py-3 pl-10 pr-3.5 text-sm outline-none transition placeholder:text-[#aaa69f] focus:border-[#c85b31] focus:ring-2 focus:ring-[#c85b31]/10"
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Cari lokasi atau detail kerusakan"
                value={searchInput}
              />
            </label>
            <label>
              <span className="sr-only">Filter tingkat kerusakan</span>
              <select
                className="w-full rounded-xl border border-[#e5e3df] bg-[#fbfaf9] px-3.5 py-3 text-sm text-[#6f6d69] outline-none transition focus:border-[#c85b31] focus:ring-2 focus:ring-[#c85b31]/10"
                onChange={(event) =>
                  setDamageInput(event.target.value as DamageLevel | "")
                }
                value={damageInput}
              >
                <option value="">Semua tingkat kerusakan</option>
                {damageLevels.map((level) => (
                  <option key={level} value={level}>
                    {getDamageLabel(level)}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e5e3df] bg-[#fbfaf9] px-4 py-3 text-sm font-semibold text-[#4b4a47] transition hover:bg-[#eeece8]"
              type="submit"
            >
              <MagnifyingGlass size={16} />
              Cari laporan
            </button>
          </form>
          <div className="mt-4 flex items-center justify-between border-t border-[#f0efed] pt-3">
            <p className="text-xs text-[#777572]">
              {loading
                ? "Memuat laporan..."
                : `${posts.length} laporan ditemukan`}
            </p>
            <button
              aria-label="Muat ulang laporan"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#6f6d69] transition hover:bg-[#f3f1ee] disabled:opacity-50"
              disabled={refreshing || loading}
              onClick={() => void loadPosts(true)}
              type="button"
            >
              <ArrowClockwise
                className={refreshing ? "animate-spin" : ""}
                size={14}
              />
              Segarkan
            </button>
          </div>
        </section>

        {error && !modalOpen && (
          <div
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}
        {notice && (
          <output
            className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            aria-live="polite"
          >
            <CheckCircle className="mt-0.5 shrink-0" size={17} weight="fill" />
            {notice}
          </output>
        )}

        <section aria-label="Daftar laporan komunitas">
          {loading ? (
            <div className="flex min-h-52 items-center justify-center gap-2 text-sm text-[#777572]">
              <Spinner className="animate-spin" size={19} />
              Memuat laporan warga...
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d8d5d0] bg-white/70 px-5 py-14 text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#f1e5df] text-[#c85b31]">
                <MapPin size={23} weight="fill" />
              </div>
              <h2 className="text-base font-semibold text-[#202123]">
                Belum ada laporan yang cocok
              </h2>
              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[#777572]">
                Coba ubah kata kunci atau filter. Jika kamu mengetahui kondisi
                di sekitar, bagikan laporan pertama.
              </p>
              <button
                className="mt-4 rounded-full bg-[#202123] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#38393a]"
                onClick={openCreateForm}
                type="button"
              >
                Buat laporan
              </button>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {posts.map((post) => {
                const isOwner = post.isOwner === true;
                const busy = busyPostId === post.id;
                const imageUrl = getSafeImageUrl(post.imageUrl);
                return (
                  <article
                    className="flex min-w-0 flex-col rounded-2xl border border-[#e5e3df] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    key={post.id}
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${damageStyles[post.damageLevel]}`}
                      >
                        {getDamageLabel(post.damageLevel)}
                      </span>
                      {isOwner && (
                        <div className="flex items-center gap-1">
                          <button
                            aria-label={`Edit laporan ${post.title}`}
                            className="rounded-lg p-2 text-[#777572] transition hover:bg-[#f3f1ee] hover:text-[#202123]"
                            onClick={() => {
                              setEditingPost(post);
                              setModalOpen(true);
                              setError(null);
                            }}
                            type="button"
                          >
                            <PencilSimple size={16} />
                          </button>
                          <button
                            aria-label={`Hapus laporan ${post.title}`}
                            className="rounded-lg p-2 text-[#777572] transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                            disabled={busy}
                            onClick={() => void handleDelete(post)}
                            type="button"
                          >
                            {busy ? (
                              <Spinner className="animate-spin" size={16} />
                            ) : (
                              <Trash size={16} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <h2 className="text-lg font-semibold leading-snug tracking-tight text-[#202123]">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-[#66635f]">
                      {post.description}
                    </p>
                    {imageUrl && (
                      <a
                        className="mt-3 inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-[#a44b29] underline decoration-[#d8b6a8] underline-offset-4 hover:text-[#7e351b]"
                        href={imageUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Lihat foto laporan
                      </a>
                    )}

                    <div className="mt-4 flex items-center gap-2 text-xs text-[#777572]">
                      <MapPin className="shrink-0 text-[#c85b31]" size={15} />
                      <span className="truncate">{post.locationName}</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#f0efed] pt-4">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f1e5df] text-xs font-bold text-[#a44b29]">
                          {post.user.nama.trim().charAt(0).toUpperCase() || "W"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-[#4b4a47]">
                            {post.user.nama}
                          </p>
                          <time
                            className="mt-0.5 block text-[10px] text-[#99958f]"
                            dateTime={post.createdAt}
                          >
                            {formatDate(post.createdAt)}
                          </time>
                        </div>
                      </div>
                      <button
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#e5e3df] px-3 py-2 text-xs font-semibold text-[#4b4a47] transition hover:border-[#c85b31]/30 hover:bg-[#fbf4f0] hover:text-[#a44b29] disabled:cursor-wait disabled:opacity-60"
                        disabled={busy}
                        onClick={() => void handleVerify(post)}
                        type="button"
                      >
                        {busy ? (
                          <Spinner className="animate-spin" size={14} />
                        ) : (
                          <ThumbsUp size={14} />
                        )}
                        Validasi
                        <span className="rounded-full bg-[#f0efed] px-1.5 py-0.5 text-[10px]">
                          {post.verifiedCount}
                        </span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <div className="mt-6 flex items-start gap-2 rounded-xl border border-[#e8e0d6] bg-[#f5f1eb] px-4 py-3 text-xs leading-5 text-[#777572]">
          <ShieldWarning className="mt-0.5 shrink-0 text-[#a66c25]" size={16} />
          Informasi warga bersifat laporan lapangan. Tetap ikuti arahan resmi
          BPBD/BNPB dan petugas setempat.
        </div>
      </div>

      {modalOpen && (
        <ReportForm
          key={editingPost?.id ?? "new-report"}
          onCancel={() => {
            if (!submitting) {
              setModalOpen(false);
              setEditingPost(null);
            }
          }}
          onSubmit={handleSave}
          post={editingPost ?? undefined}
          error={error}
          submitting={submitting}
        />
      )}
    </main>
  );
}
