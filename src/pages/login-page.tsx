import { useUser } from "@/hooks/useUser";
import httpClient from "@/lib/http-client";
import { cn } from "@/lib/utils";
import type { UserRef } from "@/types";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const LoginPage = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation<
    {
      message: string;
      token: string;
      data: UserRef;
    },
    AxiosError,
    { token: string }
  >({
    mutationKey: ["login"],
    mutationFn: async ({ token }) => {
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
      localStorage.setItem("token",token)
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

        <div className={cn(isPending && "pointer-events-none")}>
          <GoogleLogin
            onSuccess={({ credential }) => {
              if (credential) {
                mutate({ token: credential });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
