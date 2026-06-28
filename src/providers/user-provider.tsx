import { UserContext } from "@/context/user-context";
import httpClient from "@/lib/http-client";
import type { UserRef } from "@/types";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserRef | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      navigate("/login");
    };

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    httpClient
      .get<{ data: UserRef }>("/user/get-user")
      .then((res) => {
        if (res.data.data.role === "admin") {
          setUser(res.data.data);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
