"use client"

import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"


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

  return (
    <div className="flex items-center gap-4">
      <button
        className="bg-gray-300 text-gray-700 px-3 py-1 rounded disabled:opacity-50"
        onClick={() => handlePageChange(Math.max(0, offset - limit))}
        disabled={!hasPrev}
      >
        {t("items.paginationControls.prev")}
      </button>
      <span className="text-gray-600">
        {t("items.paginationControls.page")} {currentPage} {t("items.paginationControls.of")} {totalPages}
      </span>
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
        onClick={() => handlePageChange(Number(offset) + Number(limit))}
        disabled={!hasNext}
      >
        {t("items.paginationControls.next")}
      </button>
    </div>
  )
}

export default PaginationControls
