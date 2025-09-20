"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { initFlowbite } from 'flowbite'
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { FillText } from "@/components/loaders";
import { deleteItem } from "./actions";
import { toast } from "sonner";
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';
import Gallery from "./Gallery";

function handleDelete(t, id, onDelete, funs) {
    const handleGenericErrors = useGenericResponseHandler(t)

    toast(t("warehouse.items.card.remove.confirm"), {
        action: {
        label: t('warehouse.items.card.remove.yes'),
        onClick: async () => {
            const res = await deleteItem(id);
            
            if(handleGenericErrors(res)) return;
            if (res.ok) {
                toast.success(t('warehouse.items.card.remove.success'));
                onDelete?.(funs.setItems, funs.setDeletingId, id);
            }
        },
        },
        cancel: {
        label: t('warehouse.items.card.remove.no'),
        onClick: () => {
            toast.info(t('warehouse.items.card.remove.canceled'));
        },
        },
        duration: 10000,
    });
      
}

// Table Row Component
function TableRow({ id, name, origin, place, p4, imgSrc, isDeleting = false, funs}) {
    const tGlobal = useTranslations("");
    const t = useTranslations("warehouse");

    const handleOnDelete = (setItems, setDeletingId, id) => {
        // trigger fade-out
        setDeletingId(id);

        // wait for animation before removing
        setTimeout(() => {
            setItems(prev => prev.filter(repo => repo.id !== id));
            setDeletingId(null);
        }, 300); // match the transition duration
    };


    return (
        <tr 
            key={id} 
            className={`
              transition-all duration-300 ease-in-out 
              ${isDeleting ? 'opacity-0 -translate-x-5 pointer-events-none' : ''}
              bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600
            `}
        >
            <td className="w-16 p-4">
                {imgSrc && (
                    <img src={imgSrc} alt={name} className="w-10 h-10 rounded object-cover" />
                )}
            </td>
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {name}
            </th>
            <td className="px-6 py-4 text-gray-900 dark:text-white">
                {origin || '-'}
            </td>
            <td className="px-6 py-4 text-gray-900 dark:text-white">
                {place || '-'}
            </td>
            <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">
                ${p4}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                    <Link 
                        href={`/items/form/${id}`}
                        className="ml-2 flex items-center text-blue-600 group transition duration-300 dark:text-blue-500 dark:hover:text-blue-400"
                    >
                        <PencilIcon
                            className="h-4 w-4 mr-1 text-blue-500
                            transition-all duration-300 ease-in-out
                            group-hover:rotate-[8deg]
                            group-hover:-translate-y-0.5
                            group-hover:scale-110
                            group-hover:drop-shadow-sm"
                        />
                        {t("items.card.edit")}
                    </Link>
                    <button className="group flex items-center gap-1 px-2 py-1 rounded-md
                        text-red-600 dark:text-red-500 cursor-pointer
                        transition-all duration-300 ease-in-out"
                        onClick={() => handleDelete(tGlobal, id, handleOnDelete, funs=funs)}    
                    >
                        <TrashIcon
                            className="
                            h-4 w-4
                            transition-transform duration-300 ease-in-out
                            group-hover:rotate-[15deg]
                            group-hover:scale-125
                            "
                        />
                        
                        {t("items.card.delete")}
                    </button>
                </div>
            </td>
        </tr>
    );
}

// Gallery Card Component (your existing card)
function GalleryCard({ id, name, origin, place, p1, p2, p3, p4, stock, imgSrc: imageList, isDeleting = false, funs}) {
    useEffect(() => {
        initFlowbite();
    }, []);
    const t = useTranslations("warehouse");
    const tGlobal = useTranslations("");

    return (
    <div className={`
        w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700
        transform transition-all duration-300 ease-in-out
        ${isDeleting ? 'opacity-0 scale-0 h-0 p-0 m-0 overflow-hidden' : ''}
    `}>

 
            {/* menu */}
            <div className="flex justify-end px-4 pt-4">
                <button id={`dropdownButton${id}`} data-dropdown-toggle={`dropdown${id}`} className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">
                    <span className="sr-only">Open dropdown</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                    </svg>
                </button>

                <div id={`dropdown${id}`} className="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                    <ul className="py-2" aria-labelledby={`dropdownButton${id}`}>
                        <li>
                            <Link 
                                href={`/items/form/${id}`}
                                className="group flex block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                                <PencilIcon
                                    className="h-4 w-4 mr-1
                                    text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white
                                    transition-all duration-300 ease-in-out
                                    group-hover:rotate-[8deg]
                                    group-hover:-translate-y-0.5
                                    group-hover:scale-110
                                    group-hover:drop-shadow-sm"
                                />
                                {t('items.card.edit')}
                            </Link>
                        </li>
                        {/* <li>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export Data</a>
                        </li> */}
                        <li>
                            <button
                                onClick={() => handleDelete(tGlobal, id, (setItems, setDeletingId, id) => {
                                    setDeletingId(id);
                                    setTimeout(() => {
                                        setItems(prev => prev.filter(item => item.id !== id));
                                        setDeletingId(null);
                                    }, 300);
                                }, funs)}
                                className="group flex w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-500 cursor-pointer
                        transition-all duration-300 ease-in-out"
                            >
                                <TrashIcon
                                    className="
                                    h-4 w-4 mr-1
                                    transition-transform duration-300 ease-in-out
                                    group-hover:rotate-[15deg]
                                    group-hover:scale-125
                                    "
                                />
                                {t("items.card.delete")}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* origin and place */}
            <div className="flex flex-row justify-around">
                <span>{origin && `${t("items.card.origin")}: ${origin}`}</span>
                <span>{place && `${t("items.card.place")}: ${place}`}</span>
            </div>
            
            {/* <div className="max-w-[5rem] max-h-[5rem]"> */}

            {imageList && (
                <Gallery images={imageList} />
            )}
            {/* </div> */}
            <Link href={`/items/view/${id}`} className="block transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
                <div className="px-5 pb-5">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{name}</h5>
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">${p4}</span>
                        {/* <a href="#" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add to cart</a> */}
                    </div>
                </div>
            </Link>
        </div>
    );
}

// View Toggle Switch Component
function ViewToggle({ viewMode, setViewMode }) {
    const t = useTranslations("warehouse");

    return (
        <div className="flex items-center space-x-4 mb-4  flex justify-end">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                    onClick={() => setViewMode('gallery')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'gallery'
                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                    </svg>
                    <span>{t("items.card.gallery")}</span>
                </button>
                <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'table'
                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                    <span>{t("items.card.table")}</span>
                </button>
            </div>
        </div>
    );
}

// Hook for view mode management
export function useViewMode() {
    const [viewMode, setViewMode] = useState('gallery');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Load view preference from localStorage
        const savedViewMode = localStorage.getItem('items-view-mode');
        if (savedViewMode && (savedViewMode === 'gallery' || savedViewMode === 'table')) {
            setViewMode(savedViewMode);
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            // Save view preference to localStorage
            localStorage.setItem('items-view-mode', viewMode);
        }
    }, [viewMode, isClient]);

    return { viewMode, setViewMode, isClient };
}

// Table View Component
export function TableView({ items, setItems }) {
    const t = useTranslations("warehouse");
    // const [items, setItems] = useState(rawItems);
    const [deletingId, setDeletingId] = useState(null);
    
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Image</th>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Origin</th>
                        <th scope="col" className="px-6 py-3">Place</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => {
                        return (
                            <TableRow 
                                key={item.id} 
                                id={item.id}
                                name={item.name}
                                origin={item.origin}
                                place={item.place}
                                p4={item.price4}
                                imgSrc={item.images[0]}
                                isDeleting={deletingId === item.id}
                                funs={{
                                    setItems: setItems,
                                    setDeletingId: setDeletingId
                                }}
                            />)
                    })}
                </tbody>
            </table>
        </div>
    );
}

// Gallery View Component (your existing masonry layout)
export function GalleryView({ items, setItems }) {
    const [deletingId, setDeletingId] = useState(null);

    return (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 [column-width:250px] gap-4 mt-4">
        {/* <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 mt-4"> */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 transition-all duration-300"> */}
            {items.map((item) => (
                <div key={item.id} className="mb-4 break-inside-avoid mx-auto">
                    <GalleryCard
                        id={item.id}
                        name={item.name}
                        origin={item.origin}
                        place={item.place}
                        p4={item.price4}
                        imgSrc={item.images}
                        isDeleting={deletingId === item.id}
                        funs={{
                            setItems,
                            setDeletingId
                        }}
                    />
                </div>
            ))}
        </div>
    );
}


// Main Component with View Switch
export function ItemsView({ items: rawItems = [] }) {
    const { viewMode, setViewMode, isClient } = useViewMode();
    const [items, setItems] = useState(rawItems);

    useEffect(() => {
        setItems(rawItems);
    }, [rawItems]);


    if (!isClient) { 
        return (<div className="flex flex-row min-h-screen justify-center items-center">
            <FillText text="MedPro"/>
        </div>)
        // return null;
    }

    return (
        <>
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            
            {viewMode === 'gallery' ? (
                <GalleryView items={items} setItems={setItems} />
            ) : (
                <TableView items={items} setItems={setItems} />
            )}
        </>
    );
}

// If you want to keep the original Card component for backwards compatibility
export function Card(props) {
    return <GalleryCard {...props} />;
}

// Default export for backwards compatibility
export default Card;