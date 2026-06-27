import { UserContext } from "@/context/user-context";
import type { UserRef } from "@/types";
import React, { useState } from "react";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserRef | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
