'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DeleteButton from './DeleteButton';
import { PencilIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

export default function RepositoryTable({ repositories, setRepositories }) {
  const t = useTranslations("warehouse.repositories")
  const [deletingId, setDeletingId] = useState(null);

  const items = repositories;

  const handleDelete = (id) => {
    // trigger fade-out
    setDeletingId(id);

    // wait for animation before removing
    setTimeout(() => {
      if (setRepositories) {
        setRepositories(prev => prev.filter(repo => repo.id !== id));
      }
      setDeletingId(null);
    }, 300); // match the transition duration
  };



  return (
    <tbody>
      {items.map((repository) => {
        const isDeleting = deletingId === repository.id;
        return (
          <tr
            key={repository.id}
            className={`
              transition-all duration-300 ease-in-out 
              ${isDeleting ? 'opacity-0 -translate-x-5 pointer-events-none' : ''}
              bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600
            `}
          >
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {repository.name}
            </th>
            <td className="flex items-center px-6 py-4 justify-end">

              <Link
                href={`/repository/form/${repository.id}`}
                className="ml-2 flex items-center text-blue-600 hover:text-blue-800 group transition duration-300 dark:text-blue-200 dark:hover:text-white"
              >
                <PencilIcon
                  className="
                    h-4 w-4 mr-1
                    transition-all duration-300 ease-in-out
                    group-hover:rotate-[8deg]
                    group-hover:-translate-y-0.5
                    group-hover:scale-110
                    group-hover:drop-shadow-sm
                  "
                />
                <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                  {t("table.edit")}
                </span>
              </Link>

              <DeleteButton id={repository.id} onDelete={() => handleDelete(repository.id)} />

            </td>
          </tr>
        );
      })}
    </tbody>
  );
}
