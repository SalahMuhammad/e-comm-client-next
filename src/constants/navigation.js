import {
    // Warehouse icons
    CubeIcon, PlusCircleIcon, BuildingStorefrontIcon, HomeModernIcon,
    // Sales icons
    DocumentTextIcon, DocumentPlusIcon, ClockIcon,
    // Customers/Suppliers icons
    UsersIcon, UserPlusIcon,
    // Finance icons
    CreditCardIcon, BanknotesIcon, ReceiptPercentIcon, ExclamationTriangleIcon, ScaleIcon, BuildingLibraryIcon,
    // Refilled Cans icons
    BeakerIcon, UserGroupIcon, WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

export const getMenuItems = (t) => {
    const menuItems = [
        {
            head: t('warehouse.headLabel'),
            icon: (
                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">
                    <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                </svg>
            ),
            links: [
                {
                    label: t('warehouse.subLabels.items'),
                    path: '/items/list',
                    icon: <CubeIcon className="w-4 h-4" />,
                    addPath: '/items/form'
                },
                // {
                //     label: t('warehouse.subLabels.createItem'),
                //     path: '/items/form',
                //     icon: <PlusCircleIcon className="w-4 h-4" />
                // },
                {
                    label: t('warehouse.subLabels.damagedItems'),
                    path: '/items/damaged',
                    icon: <ExclamationTriangleIcon className="w-4 h-4" />,
                    addPath: '/items/damaged/form'
                },
                {
                    label: t('warehouse.subLabels.repositories'),
                    path: '/repository/list',
                    icon: <BuildingStorefrontIcon className="w-4 h-4" />,
                    addPath: '/repository/form'
                },
                // {
                //     label: t('warehouse.subLabels.createRepository'),
                //     path: '/repository/form',
                //     icon: <HomeModernIcon className="w-4 h-4" />
                // },
            ]
        },
        {
            head: t('invoice.sales.headLabel'),
            icon: (
                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 1116 0A8 8 0 012 10zm8-6a6 6 0 100 12A6 6 0 0010 4zm1 7V7a1 1 0 10-2 0v5a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414l-2.707-2.707z" />
                </svg>
            ),
            links: [
                {
                    label: t('invoice.subLabels.invoiceManagement'),
                    path: '/invoice/sales/list',
                    icon: <DocumentTextIcon className="w-4 h-4" />,
                    addPath: '/invoice/sales/form'
                },
                // {
                //     label: t('invoice.subLabels.createInvoice'),
                //     path: '/invoice/sales/form',
                //     icon: <DocumentPlusIcon className="w-4 h-4" />
                // },
                {
                    icon: <ClockIcon className="w-4 h-4" />,
                    label: t('invoice.subLabels.refund'),
                    path: '/invoice/sales/refund/list',
                }
            ]
        },
        {
            head: t('invoice.purchase.headLabel'),
            icon: (
                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 1116 0A8 8 0 012 10zm8-6a6 6 0 100 12A6 6 0 0010 4zm1 7V7a1 1 0 10-2 0v5a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414l-2.707-2.707z" />
                </svg>
            ),
            links: [
                {
                    label: t('invoice.subLabels.invoiceManagement'),
                    path: '/invoice/purchases/list',
                    icon: <DocumentTextIcon className="w-4 h-4" />,
                    addPath: '/invoice/purchases/form'
                },
                // {
                //     label: t('invoice.subLabels.createInvoice'),
                //     path: '/invoice/purchases/form',
                //     icon: <DocumentPlusIcon className="w-4 h-4" />
                // },
            ]
        },
        {
            head: t('customersSuppliers.headLabel'),
            icon: (
                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-6 8a6 6 0 1112 0H4z" />
                </svg>
            ),
            links: [
                {
                    label: t('customersSuppliers.subLabels.management'),
                    path: '/customer-supplier/list',
                    icon: <UsersIcon className="w-4 h-4" />,
                    addPath: '/customer-supplier/form'
                },
                // {
                //     label: t('customersSuppliers.subLabels.createInvoice'),
                //     path: '/customer-supplier/form',
                //     icon: <UserPlusIcon className="w-4 h-4" />
                // },
            ]
        },
        {
            head: t('finance.headLabel'),
            icon: (
                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 0v12h12V4H4zm2 2h8v2H6V6zm0 4h8v2H6v-2zm0 4h5v2H6v-2z" />
                </svg>
            ),
            links: [
                {
                    label: t('finance.subLabels.management'),
                    path: '/finance/management',
                    icon: <CreditCardIcon className="w-4 h-4" />
                },
                {
                    label: t('finance.subLabels.payments'),
                    path: '/finance/payments/list',
                    icon: <CreditCardIcon className="w-4 h-4" />,
                    addPath: '/finance/payments/form'
                },
                // { 
                //     label: t('finance.subLabels.addPayment'), 
                //     path: '/finance/payments/form',
                //     icon: <BanknotesIcon className="w-4 h-4" />
                // },
                {
                    label: t('finance.subLabels.reversePayment'),
                    path: '/finance/reverse-payment/list',
                    icon: <ReceiptPercentIcon className="w-4 h-4" />,
                    addPath: '/finance/reverse-payment/form'
                },
                // { 
                //     label: t('finance.subLabels.addReversePayment'), 
                //     path: '/finance/reverse-payment/form',
                //     icon: <ExclamationTriangleIcon className="w-4 h-4" />
                // },
                {
                    label: t('finance.subLabels.expenses'),
                    path: '/finance/expense/list',
                    icon: <ExclamationTriangleIcon className="w-4 h-4" />,
                    addPath: '/finance/expense/form'
                },
                // { 
                //     label: t('finance.subLabels.addExpenses'), 
                //     path: '/finance/expense/form',
                //     icon: <ExclamationTriangleIcon className="w-4 h-4" />
                // },
                {
                    label: t('finance.subLabels.expenseCategories'),
                    path: '/finance/expense/category/list',
                    icon: <ExclamationTriangleIcon className="w-4 h-4" />,
                    addPath: '/finance/expense/category/form'
                },
                {
                    label: t('finance.subLabels.debtSettlement'),
                    path: '/finance/debt-settlement/list',
                    icon: <ScaleIcon className="w-4 h-4" />,
                    addPath: '/finance/debt-settlement/form'
                },
                {
                    label: t('finance.subLabels.internalTransfer'),
                    path: '/finance/internal-money-transfer/list',
                    icon: <BanknotesIcon className="w-4 h-4" />,
                    addPath: '/finance/internal-money-transfer/form'
                },
                {
                    label: t('finance.subLabels.accountVault'),
                    path: '/finance/account-vault/list',
                    icon: <BuildingLibraryIcon className="w-4 h-4" />,
                    addPath: '/finance/account-vault/form'
                },
                {
                    label: t('finance.subLabels.accountTypes'),
                    path: '/finance/account-vault/type/list',
                    icon: <ScaleIcon className="w-4 h-4" />,
                    addPath: '/finance/account-vault/type/form'
                },
                // {
                //     label: t('finance.subLabels.debtSettlementForm'),
                //     path: '/finance/debt-settlement/form',
                //     icon: <ExclamationTriangleIcon className="w-4 h-4" />
                // },
            ]
        },

        {
            head: t('refilledCans.headLabel'),
            icon: (
                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm2 2v6h8V7H6zm2 2h4v2H8V9z" />
                </svg>
            ),
            links: [
                {
                    label: t('refilledCans.subLabels.refilled'),
                    path: '/refillable-items/refilled/list',
                    icon: <BeakerIcon className="w-4 h-4" />,
                    addPath: '/refillable-items/refilled/form'
                },
                // {
                //     label: t('refilledCans.subLabels.createRefilled'),
                //     path: '/refillable-items/refilled/form',
                //     icon: <BeakerIcon className="w-4 h-4" />
                // },
                {
                    label: t('refilledCans.subLabels.refund'),
                    path: '/refillable-items/refund/list',
                    icon: <UserGroupIcon className="w-4 h-4" />,
                    addPath: '/refillable-items/refund/form'
                },
                // {
                //     label: t('refilledCans.subLabels.createRefund'),
                //     path: '/refillable-items/refund/form',
                //     icon: <WrenchScrewdriverIcon className="w-4 h-4" />
                // }
            ]
        }
    ];
    return menuItems;
}