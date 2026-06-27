import httpClient from "@/lib/http-client";
import type { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async ({ signal }) => {
      const res = await httpClient.get<{ data: Category[] }>("/categories", {
        signal,
      });

      const data = res.data.data.sort((a, b) => a.order! - b.order!);

      return data;
    },
    staleTime: Infinity,
  });
