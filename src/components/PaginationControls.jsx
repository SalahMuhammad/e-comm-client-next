"use client"

import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLongRightIcon, ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import '@/styles/paginationControls.css'

function PaginationControls({ resCount, hasNext, hasPrev }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('warehouse')

  const limit = searchParams.get('limit') ?? 12
  const offset = searchParams.get('offset') ?? 0

  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(resCount / limit)

  const handlePageChange = (newOffset) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', limit);
    params.set('offset', newOffset);
    router.push(`?${params.toString()}`);
  }

  let notNext = currentPage == totalPages
  let notPrev = currentPage == 1
  return (
    <div id="paginationControls" className="flex justify-between items-center w-full">
      <div className="flex items-center gap-4 mx-auto">
        <button
          id="PrevPage"
          disabled={!hasPrev}
          onClick={() => handlePageChange(Math.max(0, offset - limit))}
          className={`transition-opacity duration-200 
            ${notPrev ? "opacity-30 cursor-not-allowed" : "opacity-93 hover:opacity-100 cursor-pointer"}
            ${!(!notPrev && notNext) && "arrowOnly"} 
          `}
        >
          <ArrowLongLeftIcon />
          {(!notPrev && notNext) && t("items.paginationControls.prev")}
        </button>

        <button
          id="NextPage"
          disabled={!hasNext}
          onClick={() => handlePageChange(Number(offset) + Number(limit))}
          className={`transition-opacity duration-200 
            ${notNext ? "opacity-30 cursor-not-allowed" : "opacity-93 hover:opacity-100 cursor-pointer"}
          `}
        >
          {t("items.paginationControls.next")}
          <ArrowLongRightIcon />
        </button>
      </div>
      <span 
        // className="text-gray-600"
      >
        {t("items.paginationControls.page")} {currentPage} {t("items.paginationControls.of")} {totalPages}
      </span>
    </div>
  )
}

export default PaginationControls
