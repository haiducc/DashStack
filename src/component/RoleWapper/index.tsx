"use client";

import { createContext, PropsWithChildren } from "react";

import { DataRoleType, RoleContextType } from "@/src/common/type";

export const RoleContext = createContext<RoleContextType>(
  {} as RoleContextType
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RoleWpparProvidrer = ({
  children,
  data,
}: PropsWithChildren<{ data?: DataRoleType }>) => {
  console.log("dataaaaaaa", data);

  return (
    <RoleContext.Provider value={{ dataRole: data }}>
      {children}
    </RoleContext.Provider>
  );
};
