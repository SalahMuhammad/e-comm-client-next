"use client"

import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLongRightIcon, ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import '@/styles/paginationControls.css'

function PaginationControls({ resCount, hasNext, hasPrev }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('paginationControls')

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

  let notNext = currentPage == totalPages || totalPages == 0
  let notPrev = currentPage == 1
  return (
    <div id="paginationControls" className="flex justify-between items-center w-full">
      <div className="flex items-center gap-4 mx-auto">
        <button
          id="PrevPage"
          disabled={!hasPrev}
          onClick={() => handlePageChange(Math.max(0, offset - limit))}
          className={`transition-opacity duration-200 text-sm sm:text-base w-[100px] sm:w-[140px]
            ${notPrev ? "opacity-30 cursor-not-allowed" : "opacity-93 hover:opacity-100 cursor-pointer"}
            ${!(!notPrev && notNext) && "arrowOnly"} 
          `}
        >
          <ArrowLongLeftIcon />
          {(!notPrev && notNext) && t("prev")}
        </button>

        <button
          id="NextPage"
          disabled={!hasNext}
          onClick={() => handlePageChange(Number(offset) + Number(limit))}
          className={`transition-opacity duration-200 text-sm sm:text-base w-[100px] sm:w-[140px]
            ${notNext ? "opacity-30 cursor-not-allowed" : "opacity-93 hover:opacity-100 cursor-pointer"}
          `}
        >
          {t("next")}
          <ArrowLongRightIcon />
        </button>
      </div>
      <span 
        className="ml-1"
      >
        {t("page")} {currentPage} {t("of")} {totalPages}
      </span>
    </div>
  )
}

export default PaginationControls
