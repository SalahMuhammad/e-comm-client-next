"use client";
import React, { createContext, useContext, useMemo } from "react";

const PermissionsContext = createContext({
  permissions: [],
  permSet: new Set(),
  isSuperuser: false,
  hasPermission: () => false,
});

export default function RoleProviderClient({ permissions = [], isSuperuser = false, children }) {
  // Create Set once and memoize for fast permission checks
  const permSet = useMemo(() => new Set(permissions || []), [permissions]);

  const value = useMemo(() => ({
    permissions,      // Array of permission strings
    permSet,          // Set for O(1) lookups
    isSuperuser,      // Boolean for superuser status
    hasPermission: (perm) => isSuperuser || permSet.has(perm),  // Superusers have all permissions
  }), [permissions, permSet, isSuperuser]);

  return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
}

/**
 * Hook to access the permissions context.
 * Throws if used outside of RoleProviderClient — catches accidental misuse early.
 * @returns {Object} { permissions, permSet, isSuperuser, hasPermission }
 */
export function useRoleContext() {
  const ctx = useContext(PermissionsContext);
  if (!ctx) {
    throw new Error(
      '[useRoleContext] Must be used inside <RoleProvider>. ' +
      'Make sure this component is wrapped by RoleProvider in the component tree.'
    );
  }
  return ctx;
}

/**
 * Hook to check if user has a specific permission
 * Always uses server-side permissions (from JWT)
 * 
 * @param {string} permission - Permission string to check (e.g., "items.view_items")
 * @returns {boolean} True if user has permission or is superuser
 */
export function useHasPermission(permission) {
  const { hasPermission } = useContext(PermissionsContext);
  return hasPermission(permission);
}
