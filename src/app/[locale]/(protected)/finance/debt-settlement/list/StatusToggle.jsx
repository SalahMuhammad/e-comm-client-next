import { changeDebtSettlementStatus } from "../actions";
import Toggle from "@/components/serverActionButtons/Toggle";
import { getTranslations } from "next-intl/server";


export default async function StatusToggle({ obj, className = "" }) {
    const t = await getTranslations("finance");


    return (
        <Toggle 
            value={obj.status === 'approved' ? true : false}
            toggleAction={async (value) => {
                'use server'
                return changeDebtSettlementStatus(
                    obj.hashed_id, 
                    value ? 'not_approved' : 'approved'
                )}
            }
            toggleValues={{
                fulfilled: t(`debtSettlement.status.approved`),
                unfulfilled: t(`debtSettlement.status.not_approved`)
            }}
        />
    );
}
