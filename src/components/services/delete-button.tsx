import httpClient from "@/lib/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const DeleteButton = ({ id }: { id: string }) => {
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation<{ message: string }, AxiosError>({
    mutationKey: ["delete", "service"],
    mutationFn: async () => {
      const res = await httpClient.delete<{ message: string }>(
        `/services/${id}`,
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
    <Button
      size={"sm"}
      variant={"destructive"}
      onClick={() => mutate()}
      disabled={isPending}
    >
      Delete
      {isPending && <Spinner data-icon="inline-start" />}
    </Button>
  );
};

export default DeleteButton;
