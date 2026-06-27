import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { UserContext } from "@/context/user-context";
import { setAccessToken } from "@/lib/auth";
import httpClient from "@/lib/http-client";
import type { UserRef } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const LoginPage = () => {
  const [token, setToken] = useState<string>("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation<
    {
      message: string;
      token: string;
      data: UserRef;
    },
    AxiosError
  >({
    mutationKey: ["login"],
    mutationFn: async () => {
      const res = await httpClient.post<{
        message: string;
        token: string;
        data: UserRef;
      }>("/auth/sign-in-with-google", {
        googleToken: token,
      });

      return res.data;
    },
    onSuccess: ({ data, token, message }) => {
      if (data.role !== "admin") return;
      setAccessToken(token);
      setUser(data);
      navigate("/");
      toast.success(message);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--gradient-sidebar)" }}
    >
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-(--shadow-elegant)">
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground font-bold text-lg"
            style={{ background: "var(--gradient-primary)" }}
          >
            B
          </div>
          <div>
            <h1 className="text-lg font-semibold">BlueMatrouh Admin</h1>
            <p className="text-xs text-muted-foreground">
              Internal console — sign in to continue
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="token">JWT Token</Label>
            <Input
              id="token"
              placeholder="Paste token from /api/auth/sign-in-with-google"
              onChange={(e) => setToken(e.currentTarget.value)}
            />
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={() => mutate()}
            disabled={isPending}
          >
            Continue to dashboard
            {isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
