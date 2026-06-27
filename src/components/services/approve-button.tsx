import httpClient from "@/lib/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const ApproveButton = ({ id }: { id: string }) => {
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation<{ message: string }, AxiosError>({
    mutationKey: ["approve", "service"],
    mutationFn: async () => {
      const res = await httpClient.post<{ message: string }>(
        `/services/approve/${id}`,
      );

      await qc.invalidateQueries({ queryKey: ["services"] });

      return res.data;
    },
    onSuccess: ({ message }) => {
      toast.success(message);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return (
    <Button size={"sm"} onClick={() => mutate()} disabled={isPending}>
      Approve
      {isPending && <Spinner data-icon="inline-start" />}
    </Button>
  );
};

export default ApproveButton;
