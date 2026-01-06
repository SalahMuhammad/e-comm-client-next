import { FillText } from "@/components/loaders"
import companyDetails from "@/constants/company"

function loading() {
  return (
    <div className="flex flex-row min-h-screen justify-center items-center">
      <FillText text={companyDetails.name}/>
    </div>
  )
}

export default loading
