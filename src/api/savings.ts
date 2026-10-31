import { api } from "../lib/api-client";

const savingBasePath = "/api/v1/saving";

export type SavingFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "bi-weekly"
  | "yearly";

export interface SavingContribution {
  id: string;
  amount: string | number;
  remarks?: string;
  paidAt?: string;
  status?: string;
  reference?: string;
}

export interface Saving {
  id: string;
  userId?: string;
  name: string;
  description?: string;
  targetAmount: string | number;
  totalSaved: string | number;
  frequency: SavingFrequency;
  currency?: string;
  autoDebit?: boolean;
  startDate: string;
  endDate: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  contributions?: SavingContribution[];
}

export interface SavingResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface SavingMessageResponse {
  status: boolean;
  message: string;
}

export interface SavingContributionResponse {
  id: string;
  paymentMethod?: string;
  amount: string | number;
  remarks?: string;
  paidAt?: string;
  status?: string;
  reference?: string;
  userId?: string;
  savingId?: string;
  createdAt?: string;
}

export interface SavingsListResponse {
  status: boolean;
  message: string;
  data: { savings: Saving[] };
}

export interface CreateSavingPayload {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  targetAmount: number;
  frequency: SavingFrequency;
  autoDebit?: boolean;
}

export type UpdateSavingPayload = Partial<CreateSavingPayload>;

export interface SavingContributionPayload {
  amount: number;
  remarks: string;
}

export interface WithdrawContributionResponse {
  reference: string;
  amount: number;
  walletBalance: number;
  savingBalance: number;
}

function ensureSuccess<T extends { status: boolean; message: string }>(
  response: T,
): T {
  if (!response.status) {
    throw new Error(response.message || "The savings request was unsuccessful.");
  }
  return response;
}

export async function createSaving(payload: CreateSavingPayload) {
  const { data } = await api.post<SavingResponse<Saving>>(
    `${savingBasePath}/create-saving`,
    payload,
  );
  return ensureSuccess(data);
}

export async function getSavings() {
  const { data } = await api.get<SavingsListResponse>(
    `${savingBasePath}/get-savings`,
  );
  return ensureSuccess(data);
}

export async function getSaving(savingId: string) {
  if (!savingId.trim()) {
    throw new Error("A saving ID is required.");
  }

  const { data } = await api.get<SavingResponse<Saving>>(
    `${savingBasePath}/get-saving/${encodeURIComponent(savingId)}`,
  );
  return ensureSuccess(data);
}

export async function updateSaving(
  savingId: string,
  payload: UpdateSavingPayload,
) {
  if (!savingId.trim()) {
    throw new Error("A saving ID is required.");
  }

  const { data } = await api.put<SavingMessageResponse | undefined>(
    `${savingBasePath}/update-saving/${encodeURIComponent(savingId)}`,
    payload,
  );
  if (data) {
    ensureSuccess(data);
  }
}

export async function deleteSaving(savingId: string) {
  if (!savingId.trim()) {
    throw new Error("A saving ID is required.");
  }

  const { data } = await api.put<SavingMessageResponse>(
    `${savingBasePath}/delete-saving/${encodeURIComponent(savingId)}`,
  );
  return ensureSuccess(data);
}

export async function withdrawContribution(
  savingId: string,
  payload: SavingContributionPayload,
) {
  if (!savingId.trim()) {
    throw new Error("A saving ID is required.");
  }

  const { data } = await api.post<
    SavingResponse<WithdrawContributionResponse>
  >(
    `${savingBasePath}/withdraw-contribution/${encodeURIComponent(savingId)}`,
    payload,
  );
  return ensureSuccess(data);
}

export async function createSavingContribution(
  savingId: string,
  payload: SavingContributionPayload,
) {
  if (!savingId.trim()) {
    throw new Error("A saving ID is required.");
  }

  const { data } = await api.post<SavingResponse<SavingContributionResponse>>(
    `/api/v1/contribution/savings/${encodeURIComponent(savingId)}/contributions`,
    payload,
  );
  return ensureSuccess(data);
}

export async function getSavingContributions(savingId: string): Promise<SavingContribution[]> {
  if (!savingId.trim()) {
    throw new Error("A saving ID is required.");
  }

  try {
    const { data } = await api.get<any>(
      `/api/v1/contribution/savings/${encodeURIComponent(savingId)}/contributions`,
    );

    if (Array.isArray(data)) {
      return data;
    }
    if (data?.data && Array.isArray(data.data)) {
      return data.data;
    }
    if (data?.data?.contributions && Array.isArray(data.data.contributions)) {
      return data.data.contributions;
    }
    if (data?.contributions && Array.isArray(data.contributions)) {
      return data.contributions;
    }
    return [];
  } catch (err: any) {
    // If backend uses saving basePath fallback
    if (err?.response?.status === 404) {
      try {
        const { data } = await api.get<any>(
          `${savingBasePath}/savings/${encodeURIComponent(savingId)}/contributions`,
        );
        if (Array.isArray(data)) return data;
        if (data?.data && Array.isArray(data.data)) return data.data;
      } catch {
        // Fall back to empty array
      }
    }
    throw err;
  }
}

export async function getContribution(contributionId: string): Promise<SavingContributionResponse> {
  if (!contributionId.trim()) {
    throw new Error("A contribution ID is required.");
  }

  try {
    const { data } = await api.get<any>(
      `/api/v1/contribution/contributions/${encodeURIComponent(contributionId)}`,
    );
    const item = data?.data?.contribution ?? data?.data ?? data?.contribution ?? data;
    return item as SavingContributionResponse;
  } catch (err: any) {
    if (err?.response?.status === 404) {
      const { data } = await api.get<any>(
        `/api/v1/contribution/${encodeURIComponent(contributionId)}`,
      );
      const item = data?.data?.contribution ?? data?.data ?? data?.contribution ?? data;
      return item as SavingContributionResponse;
    }
    throw err;
  }
}
