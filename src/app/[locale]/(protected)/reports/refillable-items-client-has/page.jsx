'use client'

import FormButton from '@/components/FormButton'
import SearchableDropdown from '@/components/SearchableDropdown'
import Form from 'next/form'
import { redirect, RedirectType } from 'next/navigation'

function page() {

    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData(e.target);
        const owner = formData.get('owner');
        redirect(`/reports/refillable-items-client-has/${owner}`, RedirectType.push);
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <SearchableDropdown
                    url={'/api/buyer-supplier-party/?s='}
                    name={`owner`}
                    placeholder={"Client-supplier"}
                />

                <FormButton
                    type="submit"
                    variant="secondary"
                    size="md"
                    bgColor="bg-neutral-200 dark:bg-neutral-700"
                    hoverBgColor="bg-neutral-100 dark:bg-neutral-800"
                    textColor="text-black dark:text-white"
                    className="w-full z-0"
                >
                    Generate
                </FormButton>
            </Form>
        </div>
    )
}

export default page
