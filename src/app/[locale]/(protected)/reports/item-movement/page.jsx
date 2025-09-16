'use client'

import FormButton from '@/components/FormButton'
import SearchableDropdown from '@/components/SearchableDropdown'
import { formatDateManual } from '@/utils/dateFormatter'
import Form from 'next/form'
import { redirect, RedirectType } from 'next/navigation'


function page() {

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const item = formData.get('item');
        const start_date = formData.get('start_date');
        const end_date = formData.get('end_date');
        const repository_id = formData.get('repository_id');

        redirect(`/reports/item-movement/results?item=${item}&start_date=${start_date}&end_date=${end_date}&repository_id=${repository_id}`, RedirectType.push)
    }

    return (
        <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <SearchableDropdown
                    url={'/api/items/?s='}
                    name={'item'}
                    placeholder={'Item'}
                />
                <SearchableDropdown
                    url={'/api/repositories/?s='}
                    name={'repository_id'}
                    placeholder={'Repository'}
                    isDisabled={true}
                />
                <div className="flex flex-col">
                    <label htmlFor="start_date" className="text-sm font-medium text-gray-600 mb-1.5">Start Date</label>
                    <input
                        className="border border-gray-300 rounded p-2"
                        type="date"
                        id="start_date"
                        name="start_date"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="end_date" className="text-sm font-medium text-gray-600 mb-1.5">End Date</label>
                    <input
                        className="border border-gray-300 rounded p-2"
                        type="date"
                        id="end_date"
                        name="end_date"
                    />
                </div>
            </div>

            <FormButton
                type="submit"
                variant="secondary"
                size="md"
                bgColor="bg-neutral-200 dark:bg-neutral-700"
                hoverBgColor="bg-neutral-100 dark:bg-neutral-800"
                textColor="text-black dark:text-white"
                className="w-full z-0 mt-4"
            >
                Generate
            </FormButton>
        </Form>
    )
}

export default page
