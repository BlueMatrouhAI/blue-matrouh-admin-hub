import { MenuContext } from "@/context/menu-context";
import React, { useState } from "react";

const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuProvider;
