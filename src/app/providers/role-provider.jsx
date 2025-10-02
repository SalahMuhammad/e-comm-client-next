import { getServerRole, getUserPermissions } from "@/utils/auth/role";
import RoleProviderClient from "./role-provider.client";

export default async function RoleProvider({ children }) {
  const role = await getServerRole();
  const permissions = await getUserPermissions();
  return (
    <RoleProviderClient role={role} permissions={permissions}>
      {children}
    </RoleProviderClient>
  );
}
