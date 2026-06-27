export interface Category {
  _id: string;
  title: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  order?: number;
  priceRequired?: boolean;
  featureCategories?: {
    _id: number;
    title: string;
    serviceCategory: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    imageUrl: string;
  }[];
}
