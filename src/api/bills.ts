import { api } from "../lib/api-client";

const billsPath = "/api/v1/bills";

export interface BillVariation {
  variation_code: string;
  name: string;
  variation_amount: string;
  fixedPrice: string;
}

export interface BillServiceDetailsResponse {
  message: string;
  data: {
    response_description: string;
    content: {
      ServiceName: string;
      serviceID: string;
      variations: BillVariation[];
    };
  };
}

export interface BillAccountVerificationResponse {
  message: string;
  data: {
    code: string;
    content: Record<string, string | number | boolean | null>;
  };
}

export interface BillPurchaseResponse {
  message: string;
  data: {
    reference?: string;
    status?: string;
    amount?: number | string;
    metadata?: {
      content?: {
        transactions?: {
          token?: string;
          [key: string]: unknown;
        };
      };
    };
  };
}

export interface BuyAirtimePayload {
  serviceID: string;
  phone: string;
  amount: number;
}

export interface BuyDataPayload extends BuyAirtimePayload {
  variation_code: string;
}

export interface VerifyTvAccountPayload {
  serviceID: string;
  smartcardNumber: string;
}

export interface BuyTvSubscriptionPayload extends VerifyTvAccountPayload {
  phone: string;
  amount: number;
  variation_code: string;
}

export interface VerifyElectricityAccountPayload {
  serviceID: string;
  meterNumber: string;
  type: "prepaid" | "postpaid";
}

export interface BuyElectricityPayload
  extends Omit<VerifyElectricityAccountPayload, "type"> {
  phone: string;
  amount: number;
  variation_code: "prepaid" | "postpaid";
}

export async function buyAirtime(payload: BuyAirtimePayload) {
  const { data } = await api.post<BillPurchaseResponse>(
    `${billsPath}/buy-airtime`,
    payload,
  );
  return data;
}

export async function getDataDetails(serviceID: string) {
  const { data } = await api.get<BillServiceDetailsResponse>(
    `${billsPath}/data-details`,
    { params: { serviceID } },
  );
  if (!Array.isArray(data.data?.content?.variations)) {
    throw new Error(data.message || "Unable to load data bundles.");
  }
  return data;
}

export async function buyData(payload: BuyDataPayload) {
  const { data } = await api.post<BillPurchaseResponse>(
    `${billsPath}/buy-data`,
    payload,
  );
  return data;
}

export async function getTvSubscriptionDetails(serviceID: string) {
  const { data } = await api.get<BillServiceDetailsResponse>(
    `${billsPath}/tv-subscription-details`,
    { params: { serviceID } },
  );
  if (!Array.isArray(data.data?.content?.variations)) {
    throw new Error(data.message || "Unable to load TV packages.");
  }
  return data;
}

export async function verifyTvAccountNumber(
  payload: VerifyTvAccountPayload,
) {
  const { data } = await api.get<BillAccountVerificationResponse>(
    `${billsPath}/verify-tv-account-number`,
    { params: payload },
  );
  if (data.data?.code !== "000") {
    throw new Error(data.message || "Unable to verify this TV account.");
  }
  return data;
}

export async function buyTvSubscription(
  payload: BuyTvSubscriptionPayload,
) {
  const { data } = await api.post<BillPurchaseResponse>(
    `${billsPath}/buy-tv-subscription`,
    payload,
  );
  return data;
}

export async function verifyElectricityAccountNumber(
  payload: VerifyElectricityAccountPayload,
) {
  const { data } = await api.get<BillAccountVerificationResponse>(
    `${billsPath}/verify-nepa-account-number`,
    { params: payload },
  );
  if (data.data?.code !== "000") {
    throw new Error(data.message || "Unable to verify this meter.");
  }
  return data;
}

export async function buyElectricity(payload: BuyElectricityPayload) {
  const { data } = await api.post<BillPurchaseResponse>(
    `${billsPath}/buy-electric-energy`,
    payload,
  );
  return data;
}
