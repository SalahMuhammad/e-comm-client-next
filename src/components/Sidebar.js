'use client'

import { initFlowbite } from 'flowbite'
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import '@/styles/sidebar.css';
import UserAvatar from './UserAvatar';
import { WrenchScrewdriverIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useEffect, useState, useRef } from 'react';
// import logout from './logout';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { getMenuItems } from '@/constants/navigation';
import { useCompany } from '@/app/providers/company-provider.client';
import { useRoleContext } from '@/app/providers/role-provider.client';

import SettingsModal from './SettingsModal';
import { API_BASE_URL } from '@/config/api';
// import { getClientAuthToken } from '@/utils/cookieHandler';

export default function Sidebar({ username, token }) {
    const t = useTranslations('navLinks');
    const companyDetails = useCompany();
    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [userData, setUserData] = useState({ username });

    useEffect(() => {
        // Initialize Flowbite when component mounts
        initFlowbite();

        // Fetch user data
        const fetchUserData = async () => {
            try {
                // const token = getClientAuthToken();
                const res = await fetch(`${API_BASE_URL}/api/users/user/`, {
                    headers: {
                        'auth': token || ''
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUserData(data);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        fetchUserData();
    }, []);

    // Monitor sidebar state changes
    useEffect(() => {
        const sidebar = sidebarRef.current;
        if (!sidebar) return;

        const checkSidebarState = () => {
            const isOpen = !sidebar.classList.contains('-translate-x-full');
            setIsSidebarOpen(isOpen);
        };

        // Check initial state
        checkSidebarState();

        // Create a MutationObserver to watch for class changes
        const observer = new MutationObserver(checkSidebarState);
        observer.observe(sidebar, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    const closeSidebar = () => {
        const sidebar = sidebarRef.current;
        if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
            sidebar.classList.add('-translate-x-full');
            setIsSidebarOpen(false);
        }
    };

    const { hasPermission } = useRoleContext();

    const [openSection, setOpenSection] = useState(null);
    const rawMenuItems = getMenuItems(t);

    const menuItems = rawMenuItems.map(section => {
        // Filter links in the section
        const filteredLinks = section.links.filter(link => {
            // If no permissions defined, show it
            if (!link.permissions || link.permissions.length === 0) return true;
            // Check if user has at least one of the required permissions
            return link.permissions.some(perm => hasPermission(perm));
        });

        return {
            ...section,
            links: filteredLinks
        };
    }).filter(section => section.links.length > 0); // Only show sections that have visible links

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>
                            <Link href="/dashboard" className="flex ms-2 md:me-24">
                                <img src={companyDetails.logo} className="h-8 me-3" alt="Med Pro Logo" />
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                                    {companyDetails.name}
                                </span>
                            </Link>
                        </div>

                        <div className="flex items-center">

                            <ThemeToggle />
                            <LanguageToggle />

                            <div className="flex items-center ms-3">
                                <div>
                                    <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                        <span className="sr-only">Open user menu</span>
                                        {/* <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" /> */}
                                        {/* <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" /> */}
                                        <UserAvatar username={userData?.username || username} imageUrl={userData?.avatar} />
                                    </button>
                                </div>
                                <div
                                    className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600 w-54 translate-x-[-7px]"
                                    id="dropdown-user"
                                >
                                    <div className="px-4 py-3" role="none">
                                        <p className="text-sm text-gray-900 dark:text-white" role="none">
                                            {(userData?.first_name || userData?.last_name)
                                                ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim()
                                                : (userData?.username || username)?.charAt(0).toUpperCase() + (userData?.username || username)?.slice(1)
                                            }
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                            @{userData?.username || username}
                                        </p>
                                    </div>
                                    <ul className="py-1" role="none">
                                        {/* <li>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</a>
                                        </li> */}
                                        {/* <li>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Earnings</a>
                                        </li> */}

                                        <li>
                                            <button
                                                type='button'
                                                onClick={() => setIsSettingsOpen(true)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                                                role="menuitem"
                                            >
                                                <Cog6ToothIcon className="h-4 w-4" />
                                                {t('userDropDown.settings')}
                                            </button>
                                        </li>

                                        <li>
                                            <Link
                                                href="/auth/logout"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                role="menuitem"
                                            // onClick={logout}
                                            >
                                                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                                {t('userDropDown.signOut')}
                                            </Link>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Backdrop overlay for mobile - only visible when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 sm:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            <aside ref={sidebarRef} id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white borderR border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800" id='SidebarDiv'>
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link href="/dashboard" onClick={closeSidebar} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                </svg>
                                <span className="ms-3">{t('dashboard.headLabel')}</span>
                                {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span> */}
                                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                            </Link>
                        </li>
                        {menuItems.map((obj, i) => (
                            <li key={i}>
                                <button
                                    type="button"
                                    className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                    // aria-controls={obj.head} 
                                    data-collapse-toggle={obj.head}
                                    onClick={() => setOpenSection(openSection === obj.head ? null : obj.head)}
                                >
                                    {obj.icon}
                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{obj.head}</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>
                                <ul
                                    id={obj.head}
                                    className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${openSection === obj.head ? 'max-h-100' : 'max-h-0'} px-2`}
                                >
                                    {obj.links.map((link, j) => (
                                        <li key={j} className="flex items-center relative group/item">
                                            <Link href={link.path} onClick={closeSidebar} className={`flex items-center w-full p-2 text-gray-900 transition-all duration-200 rounded-lg pl-3 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${link.addPath ? 'group-hover/item:pr-10' : ''}`}>
                                                {link.icon}
                                                <span className='ms-3 flex-1 text-ellipsis overflow-hidden whitespace-nowrap'>{link.label}</span>
                                            </Link>
                                            {link.addPath && (!link.addPermissions || link.addPermissions.some(perm => hasPermission(perm))) && (
                                                <Link
                                                    href={link.addPath}
                                                    onClick={closeSidebar}
                                                    title={t('quickAdd')}
                                                    className="absolute right-2 p-1.5 text-gray-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-md shadow-sm border border-gray-100 dark:border-gray-700 opacity-100 sm:opacity-0 sm:group-hover/item:opacity-100 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-all duration-200 z-10"
                                                >
                                                    <PlusIcon className="w-4 h-4" />
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}

                        {/* <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Kanban</span>
                                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
                                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                            </a>
                        </li> */}
                        {/* <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                                
                            </a>
                        </li> */}
                        {/* <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                    <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
                            </a>
                        </li> */}
                        {/* <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Sign In</span>
                            </a>
                        </li> */}
                        <li>
                            <Link href={'/reports'} onClick={closeSidebar} className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                <WrenchScrewdriverIcon className="w-4 h-4" />
                                <span className="flex-1 ms-3 whitespace-nowrap">{t("reports.headLabel")}</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/settings'} onClick={closeSidebar} className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                <WrenchScrewdriverIcon className="w-4 h-4" />
                                <span className="flex-1 ms-3 whitespace-nowrap">{t("settings")}</span>
                            </Link>
                        </li>
                        <li>
                            <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                                    <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                                    <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">{t('signUp')}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
            {/* Settings Modal */}
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                userData={userData}
                onUpdate={(newUserData) => setUserData(newUserData)}
                token={token}
            />
        </>
    )
}
