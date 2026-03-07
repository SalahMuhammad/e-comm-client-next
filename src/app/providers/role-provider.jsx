import { getUserPermissionsAndStatus } from "@/utils/auth/role";
import RoleProviderClient from "./role-provider.client";

export default async function RoleProvider({ children }) {
  // Use shared utility to get both permissions and superuser status from JWT
  const { permissions, isSuperuser } = await getUserPermissionsAndStatus();

  return (
    <RoleProviderClient permissions={permissions} isSuperuser={isSuperuser}>
      {children}
    </RoleProviderClient>
  );
}
