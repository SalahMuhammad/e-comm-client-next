"use client";
import React, { createContext, useContext, useMemo } from "react";
import { usePermission } from "@/utils/auth/auth";

const RoleContext = createContext({
  role: "guest",
  permissions: [],
  permSet: new Set(),
  hasPermission: () => false,
});

export default function RoleProviderClient({ role = "guest", permissions = [], children }) {
  // Create Set once and memoize
  const permSet = useMemo(() => new Set(permissions || []), [permissions]);

  const value = useMemo(() => ({
    role,
    permissions,   // keep array if you need it
    permSet,       // expose Set for very fast checks
    hasPermission: (perm) => permSet.has(perm),
  }), [role, permissions, permSet]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

// hook to read role + helpers
export function useRole() {
  const { role } = useContext(RoleContext);

  return role
}

export function useRoleContext() {
  return useContext(RoleContext);
}

export function useHasPermission(permission, useServer = true) {
  const ctx = useContext(RoleContext);
  if (!ctx) return false;

  return usePermission(permission, [ctx.role], ctx.permSet, useServer);
}
