/**
 * Local cache helpers for API-dependent / dynamic transfer data.
 * Static project copy lives in the bundle; this stores the last
 * successful transfer attempt so it can be shown while offline.
 */

const TRANSFER_CACHE_KEY = "farmer-payment:last-transfer";

export type CachedTransfer = {
  action: string;
  project: string;
  timestamp: string;
  farmer_count: number;
  status: "success" | "pending" | "failed";
  synced: boolean;
};

export function saveLastTransfer(data: CachedTransfer): void {
  try {
    localStorage.setItem(TRANSFER_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore quota / private-mode errors
  }
}

export function getLastTransfer(): CachedTransfer | null {
  try {
    const raw = localStorage.getItem(TRANSFER_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CachedTransfer;
  } catch {
    return null;
  }
}

export const PROJECT_INFO = {
  name: "URVARA",
  title: "URVARA – Honouring the Hands that Heal the Soil",
  subtitle: "Carbon Credit Earnings Transfer to Farmers",
  tagline: "Soil to School to Society",
  farmerCount: 6000,
} as const;
