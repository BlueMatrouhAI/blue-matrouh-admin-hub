export interface UserRef {
  _id?: string;
  id?: string;
  email?: string;
  username?: string;
  phoneNumber?: string;
  status?: string;
  role?: string;
  isSeller?: boolean;
  imageUrl?: string;
  isDeleted?: boolean;
  verificationImages?: string[];
};
