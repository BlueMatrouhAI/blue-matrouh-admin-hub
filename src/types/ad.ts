import type { Service } from "./service";

export interface Ad {
  _id: string;
  serviceId?: Service | string;
  startTime?: string;
  endTime?: string;
}