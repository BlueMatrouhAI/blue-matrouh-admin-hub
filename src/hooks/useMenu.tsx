import { MenuContext } from "@/context/menu-context";
import { useContext } from "react";

export const useMenu = () => {
  const ctx = useContext(MenuContext);

  return ctx;
};
