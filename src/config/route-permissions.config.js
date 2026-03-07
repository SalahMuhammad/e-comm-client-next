/**
 * Route Permissions Configuration
 * 
 * Maps client-side routes to server-side Django permissions.
 * This configuration is used by middleware to protect routes from unauthorized access.
 * 
 * Format:
 * - Key: Route pattern (supports exact paths, wildcards *, and params :id)
 * - Value: Array of permission strings OR "public"
 * 
 * Permission Logic:
 * - User needs ANY permission from the array (OR logic)
 * - "public" routes are accessible to all authenticated users
 * - Routes not listed here require authentication but no specific permissions
 * 
 * Permission Format: "app_label.action_model"
 * Example: "items.view_items", "sales.add_salesinvoice"
 */

export const routePermissions = {
    // ============================================================================
    // DASHBOARD & SETTINGS ROUTES
    // ============================================================================
    "/dashboard": "public",
    "/reports": "public",
    "/settings": ["superuser_only"],

    // ============================================================================
    // WAREHOUSE ROUTES
    // ============================================================================

    // Items Management
    "/items/list": ["items.view_items"],
    "/items/form": ["items.add_items"],
    "/items/form/:id": ["items.change_items"],
    "/items/view/:id": ["items.view_items"],

    // Damaged Items
    "/items/damaged": ["items.view_damageditems"],
    "/items/damaged/form": ["items.add_damageditems"],
    "/items/damaged/form/:id": ["items.change_damageditems"],

    // Repositories
    "/repository/list": ["repositories.view_repositories"],
    "/repository/form": ["repositories.add_repositories"],
    "/repository/form/:id": ["repositories.change_repositories"],

    // ============================================================================
    // SALES INVOICE ROUTES
    // ============================================================================
    "/invoice/sales/list": ["sales.view_salesinvoice"],
    "/invoice/sales/form": ["sales.add_salesinvoice"],
    "/invoice/sales/form/:id": ["sales.change_salesinvoice"],
    "/invoice/sales/view/:id": ["sales.view_salesinvoice"],
    "/invoice/sales/refund/list": ["sales.view_returninvoice"],

    // ============================================================================
    // PURCHASE INVOICE ROUTES
    // ============================================================================
    "/invoice/purchases/list": ["purchase.view_purchaseinvoices"],
    "/invoice/purchases/form": ["purchase.add_purchaseinvoices"],
    "/invoice/purchases/form/:id": ["purchase.change_purchaseinvoices"],
    "/invoice/purchases/view/:id": ["purchase.view_purchaseinvoices"],

    // ============================================================================
    // CUSTOMERS & SUPPLIERS ROUTES
    // ============================================================================
    "/customer-supplier/list": ["buyer_supplier_party.view_party"],
    "/customer-supplier/form": ["buyer_supplier_party.add_party"],
    "/customer-supplier/form/:id": ["buyer_supplier_party.change_party"],
    "/customer-supplier/view/:id": ["buyer_supplier_party.view_party"],

    // ============================================================================
    // FINANCE ROUTES
    // ============================================================================

    // Finance Management (multiple permissions allowed)
    "/finance/management": [
        "vault_and_methods.view_businessaccount",
        "vault_and_methods.change_businessaccount"
    ],

    // Payments
    "/finance/payments/list": ["payment.view_payment2"],
    "/finance/payments/form": ["payment.add_payment2"],
    "/finance/payments/form/:id": ["payment.change_payment2"],

    // Reverse Payment
    "/finance/reverse-payment/list": ["reverse_payment.view_reversepayment2"],
    "/finance/reverse-payment/form": ["reverse_payment.add_reversepayment2"],
    "/finance/reverse-payment/form/:id": ["reverse_payment.change_reversepayment2"],

    // Expenses
    "/finance/expense/list": ["expenses.view_expense"],
    "/finance/expense/form": ["expenses.add_expense"],
    "/finance/expense/form/:id": ["expenses.change_expense"],

    // Expense Categories
    "/finance/expense/category/list": ["expenses.view_category"],
    "/finance/expense/category/form": ["expenses.add_category"],
    "/finance/expense/category/form/:id": ["expenses.change_category"],

    // Debt Settlement
    "/finance/debt-settlement/list": ["debt_settlement.view_debtsettlement"],
    "/finance/debt-settlement/form": ["debt_settlement.add_debtsettlement"],
    "/finance/debt-settlement/form/:id": ["debt_settlement.change_debtsettlement"],

    // Internal Transfer
    "/finance/internal-money-transfer/list": ["transfer.view_moneytransfer"],
    "/finance/internal-money-transfer/form": ["transfer.add_moneytransfer"],
    "/finance/internal-money-transfer/form/:id": ["transfer.change_moneytransfer"],

    // Account & Vault
    "/finance/account-vault/list": ["vault_and_methods.view_businessaccount"],
    "/finance/account-vault/form": ["vault_and_methods.add_businessaccount"],
    "/finance/account-vault/form/:id": ["vault_and_methods.change_businessaccount"],

    // Account Types
    "/finance/account-vault/type/list": ["vault_and_methods.view_accounttype"],
    "/finance/account-vault/type/form": ["vault_and_methods.add_accounttype"],
    "/finance/account-vault/type/form/:id": ["vault_and_methods.change_accounttype"],

    // ============================================================================
    // REFILLABLE ITEMS ROUTES
    // ============================================================================

    // Refilled Items
    "/refillable-items/refilled/list": ["refillable_items_system.view_refilleditem"],
    "/refillable-items/refilled/form": ["refillable_items_system.add_refilleditem"],
    "/refillable-items/refilled/form/:id": ["refillable_items_system.change_refilleditem"],

    // Refund
    "/refillable-items/refund/list": ["refillable_items_system.view_refundedrefillableitem"],
    "/refillable-items/refund/form": ["refillable_items_system.add_refundedrefillableitem"],
    "/refillable-items/refund/form/:id": ["refillable_items_system.change_refundedrefillableitem"],

    // ============================================================================
    // USER MANAGEMENT ROUTES
    // ============================================================================
    "/permission-management": ["auth.view_permission"],
    "/user-management/list": ["users.view_user"],
    "/user-management/form": ["users.add_user"],
    "/user-management/form/:id": ["users.change_user"],
};

/**
 * Get all defined route patterns
 * @returns {string[]} Array of route patterns
 */
export function getRoutePatterns() {
    return Object.keys(routePermissions);
}

/**
 * Check if a route is marked as public
 * @param {string} route - Route pattern
 * @returns {boolean}
 */
export function isPublicRoute(route) {
    return routePermissions[route] === "public";
}
