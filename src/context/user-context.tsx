import type { UserRef } from "@/types";
import { createContext } from "react";

interface IUserContext {
  setUser: (user: UserRef) => void;
  user: UserRef | null;
}

export const UserContext = createContext<IUserContext>({
  setUser: () => {},
  user: null,
});
