import React, { createContext } from "react";

interface MenuProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MenuContext = createContext<MenuProps>({
  open: false,
  setOpen: () => {},
});
