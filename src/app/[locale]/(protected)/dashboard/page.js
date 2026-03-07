import DashboardGridClient from "@/components/dashboard/DashboardGridClient";
import { WIDGET_REGISTRY } from "./_widgets/configs";
import * as WidgetComponents from "./_widgets";
import { Suspense } from "react";
import { getUserPermissionsAndStatus } from "@/utils/auth/role";
import { PERMISSIONS } from "@/config/permissions.config";

function WidgetSkeleton({ compact = false }) {
  return (
    <div className={`w-full h-full flex items-center justify-center ${compact ? 'p-4' : 'p-6'}`}>
      <div className="w-full space-y-3 animate-pulse">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full" />
      </div>
    </div>
  );
}

/** Resolve a dot-path permission string like "SALES_INVOICES.VIEW" against the PERMISSIONS object */
function resolvePermission(permPath) {
  if (!permPath) return null;
  return permPath.split('.').reduce((obj, key) => obj?.[key], PERMISSIONS) ?? null;
}

export default async function Dashboard() {
  // ── Server-side permission check ───────────────────────────────────────────
  const { permissions: userPermissions, isSuperuser } = await getUserPermissionsAndStatus();

  // Build the widget map filtered by permission.
  // Widgets the user can't access are completely absent — they won't appear
  // in the grid OR in the "Add widget" library on the client.
  const availableWidgets = Object.fromEntries(
    Object.values(WIDGET_REGISTRY)
      .filter((config) => {
        // null / undefined permission = no restriction
        if (!config.permission) return true;
        if (isSuperuser) return true;
        const requiredPerm = resolvePermission(config.permission);
        return requiredPerm && userPermissions.includes(requiredPerm);
      })
      .map((config) => {
        const Component = WidgetComponents[config.componentName];
        return [
          config.id,
          <Suspense key={config.id} fallback={<WidgetSkeleton compact={config.compact} />}>
            <Component />
          </Suspense>,
        ];
      })
  );

  return (
    <div className="w-full min-h-[calc(100vh-56px)]">
      <DashboardGridClient availableWidgets={availableWidgets} />
    </div>
  );
}
