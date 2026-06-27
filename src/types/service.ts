import type { Category } from "./category";
import type { UserRef } from "./user-ref";

export interface ServiceArea {
  areaId: string;
  areaName: string;
}

export interface Service {
  _id: string;
  title: string;
  description?: string;
  serviceCatId?: Category | string;
  userId?: UserRef | string;
  area?: ServiceArea | string;
  location?: string;
  price?: number;
  features?: {
    featureCategoryId: number;
    featureCategoryTitle: string;
    featureCategoryImageUrl: string;
    featureCategoryType: string;
    value: number;
  }[];
  imageUrls?: string[];
  status?: "Pending" | "Approved" | "Rejected" | string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  reviewCount: number;
  avgRating: number;
  offerDescription?: string;
  discountPercentage?: number;
}
