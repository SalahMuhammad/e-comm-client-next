'use client';

import { FillText } from "@/components/loaders"
import { useCompany } from "@/app/providers/company-provider.client"

function Loading() {
  const companyDetails = useCompany();

  return (
    <div className="flex flex-row min-h-screen justify-center items-center">
      <FillText text={companyDetails.name} />
    </div>
  )
}

export default Loading

