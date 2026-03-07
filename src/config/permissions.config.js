/**
 * Centralized Permission Configuration
 * 
 * This file contains all permission constants used throughout the application.
 * Permissions follow Django's format: 'app_label.action_model'
 * 
 * Benefits:
 * - Single source of truth for all permissions
 * - Type-safe constants prevent typos
 * - Easy to maintain and update
 * - Follows enterprise application patterns
 */

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const PERMISSIONS = {
    // User Management
    USERS: {
        VIEW: 'users.view_user',
        ADD: 'users.add_user',
        CHANGE: 'users.change_user',
        DELETE: 'users.delete_user',
    },

    // Groups & Permissions
    GROUPS: {
        VIEW: 'auth.view_group',
        ADD: 'auth.add_group',
        CHANGE: 'auth.change_group',
        DELETE: 'auth.delete_group',
    },

    PERMISSIONS: {
        VIEW: 'auth.view_permission',
    },

    // Items/Products
    ITEMS: {
        VIEW: 'items.view_items',
        ADD: 'items.add_items',
        CHANGE: 'items.change_items',
        DELETE: 'items.delete_items',

        // Item Barcodes
        BARCODES: {
            VIEW: 'items.view_barcode',
            ADD: 'items.add_barcode',
            CHANGE: 'items.change_barcode',
            DELETE: 'items.delete_barcode',
        },

        // Item Images
        IMAGES: {
            VIEW: 'items.view_images',
            ADD: 'items.add_images',
            CHANGE: 'items.change_images',
            DELETE: 'items.delete_images',
        },
    },

    // Repositories/Warehouses
    REPOSITORIES: {
        VIEW: 'repositories.view_repositories',
        ADD: 'repositories.add_repositories',
        CHANGE: 'repositories.change_repositories',
        DELETE: 'repositories.delete_repositories',
    },

    // Invoices - Purchase
    PURCHASE_INVOICES: {
        VIEW: 'purchase.view_purchaseinvoices',
        ADD: 'purchase.add_purchaseinvoices',
        CHANGE: 'purchase.change_purchaseinvoices',
        DELETE: 'purchase.delete_purchaseinvoices',
    },

    // Invoices - Sales
    SALES_INVOICES: {
        VIEW: 'sales.view_salesinvoice',
        ADD: 'sales.add_salesinvoice',
        CHANGE: 'sales.change_salesinvoice',
        DELETE: 'sales.delete_salesinvoice',
    },

    // Finance - Payments
    PAYMENTS: {
        VIEW: 'payment.view_payment2',
        ADD: 'payment.add_payment2',
        CHANGE: 'payment.change_payment2',
        DELETE: 'payment.delete_payment2',
    },

    // Finance - Reverse Payments
    REVERSE_PAYMENTS: {
        VIEW: 'reverse_payment.view_reversepayment2',
        ADD: 'reverse_payment.add_reversepayment2',
        CHANGE: 'reverse_payment.change_reversepayment2',
        DELETE: 'reverse_payment.delete_reversepayment2',
    },

    // Finance - Expenses
    EXPENSES: {
        VIEW: 'expenses.view_expense',
        ADD: 'expenses.add_expense',
        CHANGE: 'expenses.change_expense',
        DELETE: 'expenses.delete_expense',
    },

    // Finance - Vault/Methods
    VAULTS: {
        VIEW: 'vault_and_methods.view_vault',
        ADD: 'vault_and_methods.add_vault',
        CHANGE: 'vault_and_methods.change_vault',
        DELETE: 'vault_and_methods.delete_vault',
    },

    // Employees
    EMPLOYEES: {
        VIEW: 'employees.view_employee',
        ADD: 'employees.add_employee',
        CHANGE: 'employees.change_employee',
        DELETE: 'employees.delete_employee',
    },

    // Reports
    REPORTS: {
        VIEW: 'reports.view_report',
    },

    // Services (System Settings)
    SERVICES: {
        VIEW: 'services.view_service',
        CHANGE: 'services.change_service',
    },

    // Parties (Customers/Suppliers)
    PARTIES: {
        VIEW: 'buyer_supplier_party.view_party',
        ADD: 'buyer_supplier_party.add_party',
        CHANGE: 'buyer_supplier_party.change_party',
        DELETE: 'buyer_supplier_party.delete_party',
    },

    // Damaged Items
    DAMAGED_ITEMS: {
        VIEW: 'items.view_damageditems',
        ADD: 'items.add_damageditems',
        CHANGE: 'items.change_damageditems',
        DELETE: 'items.delete_damageditems',
    },

    // Item Types
    TYPES: {
        VIEW: 'items.view_types',
        ADD: 'items.add_types',
        CHANGE: 'items.change_types',
        DELETE: 'items.delete_types',
    },

    // Payment Methods
    PAYMENT_METHODS: {
        VIEW: 'payment_method.view_paymentmethod',
        ADD: 'payment_method.add_paymentmethod',
        CHANGE: 'payment_method.change_paymentmethod',
        DELETE: 'payment_method.delete_paymentmethod',
    },

    // Expense Categories
    EXPENSE_CATEGORIES: {
        VIEW: 'expenses.view_category',
        ADD: 'expenses.add_category',
        CHANGE: 'expenses.change_category',
        DELETE: 'expenses.delete_category',
    },

    // Expense Payments
    EXPENSE_PAYMENTS: {
        VIEW: 'payments.view_expensepayment',
        ADD: 'payments.add_expensepayment',
        CHANGE: 'payments.change_expensepayment',
        DELETE: 'payments.delete_expensepayment',
    },

    // Debt Settlement
    DEBT_SETTLEMENT: {
        VIEW: 'debt_settlement.view_debtsettlement',
        ADD: 'debt_settlement.add_debtsettlement',
        CHANGE: 'debt_settlement.change_debtsettlement',
        DELETE: 'debt_settlement.delete_debtsettlement',
    },

    // Return Invoices (Sales & Purchase)
    RETURN_INVOICES: {
        VIEW: 'sales.view_returninvoice',
        ADD: 'sales.add_returninvoice',
        CHANGE: 'sales.change_returninvoice',
        DELETE: 'sales.delete_returninvoice',
    },

    // Refillable Items System
    REFILLABLE_ITEMS: {
        VIEW: 'refillable_items_system.view_refilleditem',
        ADD: 'refillable_items_system.add_refilleditem',
        CHANGE: 'refillable_items_system.change_refilleditem',
        DELETE: 'refillable_items_system.delete_refilleditem',
    },

    // Refunded Refillable Items
    REFUNDED_REFILLABLE_ITEMS: {
        VIEW: 'refillable_items_system.view_refundedrefillableitem',
        ADD: 'refillable_items_system.add_refundedrefillableitem',
        CHANGE: 'refillable_items_system.change_refundedrefillableitem',
        DELETE: 'refillable_items_system.delete_refundedrefillableitem',
    },

    // Item Transfers
    TRANSFERS: {
        VIEW: 'transfer_items.view_transfer',
        ADD: 'transfer_items.add_transfer',
        CHANGE: 'transfer_items.change_transfer',
        DELETE: 'transfer_items.delete_transfer',
    },

    // Internal Money Transfers
    INTERNAL_MONEY_TRANSFER: {
        VIEW: 'transfer.view_moneytransfer',
        ADD: 'transfer.add_moneytransfer',
        CHANGE: 'transfer.change_moneytransfer',
        DELETE: 'transfer.delete_moneytransfer',
    },

    // Account Types (Vaults)
    ACCOUNT_TYPES: {
        VIEW: 'vault_and_methods.view_accounttype',
        ADD: 'vault_and_methods.add_accounttype',
        CHANGE: 'vault_and_methods.change_accounttype',
        DELETE: 'vault_and_methods.delete_accounttype',
    },

    // Business Accounts
    BUSINESS_ACCOUNTS: {
        VIEW: 'vault_and_methods.view_businessaccount',
        ADD: 'vault_and_methods.add_businessaccount',
        CHANGE: 'vault_and_methods.change_businessaccount',
        DELETE: 'vault_and_methods.delete_businessaccount',
    },
};

// ============================================================================
// FEATURE TO PERMISSION MAPPING
// ============================================================================

/**
 * Maps UI features (routes, buttons, etc.) to required permissions
 * Format: 'feature-key': [array of required permissions]
 * 
 * - For routes: Use the route path as key
 * - For actions: Use descriptive key like 'add-user-button'
 * - Multiple permissions = user needs ANY of them (OR logic)
 * - Use requireAll in component for AND logic
 */
export const FEATURE_PERMISSIONS = {
    // ==================== Navigation Routes ====================
    '/user-management': [PERMISSIONS.USERS.VIEW],
    '/permission-management': [PERMISSIONS.GROUPS.VIEW, PERMISSIONS.PERMISSIONS.VIEW],
    '/items': [PERMISSIONS.ITEMS.VIEW],
    '/repositories': [PERMISSIONS.REPOSITORIES.VIEW],
    '/invoices/purchase': [PERMISSIONS.PURCHASE_INVOICES.VIEW],
    '/invoices/sales': [PERMISSIONS.SALES_INVOICES.VIEW],
    '/finance/payments': [PERMISSIONS.PAYMENTS.VIEW],
    '/finance/expenses': [PERMISSIONS.EXPENSES.VIEW],
    '/finance/vaults': [PERMISSIONS.VAULTS.VIEW],
    '/employees': [PERMISSIONS.EMPLOYEES.VIEW],
    // NOTE: /reports is intentionally omitted — it's a public route accessible
    // to all authenticated users (see route-permissions.config.js).
    '/settings': [PERMISSIONS.SERVICES.VIEW],

    // ==================== User Management Actions ====================
    'add-user': [PERMISSIONS.USERS.ADD],
    'edit-user': [PERMISSIONS.USERS.CHANGE],
    'delete-user': [PERMISSIONS.USERS.DELETE],
    'view-user-details': [PERMISSIONS.USERS.VIEW],

    // ==================== Group Management Actions ====================
    'add-group': [PERMISSIONS.GROUPS.ADD],
    'edit-group': [PERMISSIONS.GROUPS.CHANGE],
    'delete-group': [PERMISSIONS.GROUPS.DELETE],
    'view-group-details': [PERMISSIONS.GROUPS.VIEW],

    // ==================== Item Management Actions ====================
    'add-item': [PERMISSIONS.ITEMS.ADD],
    'edit-item': [PERMISSIONS.ITEMS.CHANGE],
    'delete-item': [PERMISSIONS.ITEMS.DELETE],
    'view-item-details': [PERMISSIONS.ITEMS.VIEW],

    // Add more as needed...
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all permissions for a specific module
 * Useful for checking if user has any access to a module
 */
export function getModulePermissions(moduleName) {
    return PERMISSIONS[moduleName] ? Object.values(PERMISSIONS[moduleName]) : [];
}

/**
 * Check if a feature requires permissions
 */
export function featureRequiresPermissions(featureKey) {
    return !!FEATURE_PERMISSIONS[featureKey];
}

/**
 * Get required permissions for a feature
 */
export function getFeaturePermissions(featureKey) {
    return FEATURE_PERMISSIONS[featureKey] || [];
}
