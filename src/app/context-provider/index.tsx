"use client";
import { createContext, useContext } from "react";

interface UserContextType {
  userPromise: Promise<any>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserContextProvider({
  userPromise,
  children,
}: {
  userPromise: Promise<any>;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ userPromise }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
}
