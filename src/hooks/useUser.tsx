import { UserContext } from "@/context/user-context";
import { useContext } from "react";

export const useUser = () => {
  const ctx = useContext(UserContext);
  return ctx;
};
