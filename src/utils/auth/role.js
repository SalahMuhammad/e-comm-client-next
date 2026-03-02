import { cache } from 'react';
import { apiRequest } from '../api';

/**
 * Shared utility to get user permissions and superuser status from API.
 * Used by both RoleProvider and PermissionGateServer for consistency.
 * Fetched from /api/users/user/ endpoint.
 *
 * Wrapped in React cache() so that multiple calls within the same server
 * render cycle (e.g. RoleProvider + PermissionGateServer) are deduplicated
 * into a single HTTP request — eliminating the double-fetch problem.
 *
 * @returns {Promise<{permissions: string[], isSuperuser: boolean}>}
 */
export const getUserPermissionsAndStatus = cache(async function _getUserPermissionsAndStatus() {
  try {
    const response = await apiRequest('/api/users/user/', {
      method: 'GET',
    });

    if (response.ok) {
      return {
        permissions: response.data.permissions || [],
        isSuperuser: response.data.is_superuser || false,
      };
    }

    return { permissions: [], isSuperuser: false };
  } catch (error) {
    console.error('Failed to fetch permissions from API:', error);
    return { permissions: [], isSuperuser: false };
  }
});

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use getUserPermissionsAndStatus instead
 */
export async function getUserPermissions() {
  const { permissions } = await getUserPermissionsAndStatus();
  return permissions;
}

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use getUserPermissionsAndStatus instead
 */
export async function getIsSuperuser() {
  const { isSuperuser } = await getUserPermissionsAndStatus();
  return isSuperuser;
}