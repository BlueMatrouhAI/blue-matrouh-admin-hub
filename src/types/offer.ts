import type { Service } from "./service";

export interface Offer {
  _id: string;
  serviceId?: Service | string;
  offerDescription?: string;
  discountPercentage?: number;
  imagesUrl?: string[];
  qrCode?: string;
  promoCode?: string;
  startTime?: string;
  endTime?: string;
  status?: "pending" | "approved" | "rejected" | string;
}
