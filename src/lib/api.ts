export type DamageLevel = "RINGAN" | "SEDANG" | "BERAT" | "DARURAT";

export interface CommunityPostUser {
  id: number;
  nama: string;
  avatar: string | null;
}

export interface CommunityPost {
  id: number;
  userId: number;
  title: string;
  description: string;
  locationName: string;
  latitude: number | null;
  longitude: number | null;
  damageLevel: DamageLevel;
  imageUrl: string | null;
  verifiedCount: number;
  isOwner?: boolean;
  createdAt: string;
  updatedAt: string;
  user: CommunityPostUser;
}

export interface CommunityPostInput {
  title: string;
  description: string;
  locationName: string;
  damageLevel?: DamageLevel;
  imageUrl?: string | null;
  latitude?: number;
  longitude?: number;
}

export interface CommunityPostFilters {
  search?: string;
  damageLevel?: DamageLevel;
}

export type UserSituation =
  | "indoor"
  | "highrise"
  | "outdoor"
  | "coastal"
  | "driving";

export interface EvacuationRequest {
  magnitude?: number;
  depthKm?: number;
  distanceKm?: number;
  userSituation?: UserSituation;
  specialConditions?: string[];
  locationName?: string;
}

export interface EvacuationGuidance {
  urgencyLevel: "DARURAT" | "WASPADA" | "SIAGA" | "AMAN";
  headline: string;
  immediateActions: string[];
  hazardWarnings: string[];
  itemsToBring: string[];
  evacuationDirection: string;
  emergencyContacts: Array<{
    name: string;
    number: string;
    description: string;
  }>;
  disclaimer: string;
  source: "ai" | "protocol_fallback";
}

interface ApiSuccess<T> {
  success: true;
  data: T;
  count?: number;
  message?: string;
}

interface CommunityFeedResponse extends ApiSuccess<CommunityPost[]> {
  count: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function fetchApiPayload(
  path: string,
  init?: RequestInit,
): Promise<Record<string, unknown>> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    headers,
  });
  const payload: unknown = await response.json();

  if (!response.ok || !isRecord(payload) || payload.success !== true) {
    throw new Error(
      isRecord(payload) && typeof payload.message === "string"
        ? payload.message
        : `Permintaan gagal (HTTP ${response.status}).`,
    );
  }

  return payload;
}

async function requestApi<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiSuccess<T>> {
  const payload = await fetchApiPayload(path, init);
  if (!("data" in payload)) {
    throw new Error("Respons API tidak menyertakan data.");
  }
  return payload as unknown as ApiSuccess<T>;
}

export async function fetchCommunityPosts(
  filters: CommunityPostFilters = {},
): Promise<CommunityFeedResponse> {
  const searchParams = new URLSearchParams();
  if (filters.search?.trim()) {
    searchParams.set("search", filters.search.trim());
  }
  if (filters.damageLevel) {
    searchParams.set("damageLevel", filters.damageLevel);
  }

  const query = searchParams.toString();
  const result = await requestApi<CommunityPost[]>(
    `/api/community${query ? `?${query}` : ""}`,
  );
  if (typeof result.count !== "number") {
    throw new Error("Respons feed komunitas tidak menyertakan jumlah laporan.");
  }
  return { ...result, count: result.count };
}

export function createCommunityPost(
  post: CommunityPostInput,
): Promise<ApiSuccess<CommunityPost>> {
  return requestApi<CommunityPost>("/api/community", {
    method: "POST",
    body: JSON.stringify(post),
  });
}

export function updateCommunityPost(
  id: number,
  post: Partial<CommunityPostInput>,
): Promise<ApiSuccess<CommunityPost>> {
  return requestApi<CommunityPost>(`/api/community/${id}`, {
    method: "PUT",
    body: JSON.stringify(post),
  });
}

export function deleteCommunityPost(id: number): Promise<string> {
  return fetchApiPayload(`/api/community/${id}`, {
    method: "DELETE",
  }).then((payload) => {
    if (typeof payload.message !== "string") {
      throw new Error("Respons API tidak menyertakan pesan konfirmasi.");
    }
    return payload.message;
  });
}

export function verifyCommunityPost(
  id: number,
): Promise<ApiSuccess<{ id: number; verifiedCount: number }>> {
  return requestApi<{ id: number; verifiedCount: number }>(
    `/api/community/${id}/verify`,
    { method: "POST" },
  );
}

export function fetchEvacuationGuidance(
  request: EvacuationRequest,
): Promise<ApiSuccess<EvacuationGuidance>> {
  return requestApi<EvacuationGuidance>("/api/evacuation-assistant", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
