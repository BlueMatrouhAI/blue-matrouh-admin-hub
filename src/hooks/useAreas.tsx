import httpClient from "@/lib/http-client";
import type { Area } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useAreas = () =>
  useQuery({
    queryKey: ["areas"],
    queryFn: async ({ signal }) => {
      const res = await httpClient.get<{ data: Area[] }>("/areas", { signal });

      const data = res.data.data;

      return data;
    },
    staleTime: Infinity,
  });
