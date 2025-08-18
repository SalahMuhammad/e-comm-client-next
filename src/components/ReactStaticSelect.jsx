import { useId } from 'react';
import Select from 'react-select'


const StaticSelect = ({ options, label, ...props }) => {
    const selectId = useId();


    return (
        <div
            className="relative z-0 w-full my-7 group"
            onClick={(e) => e.stopPropagation()}
        >
            <Select
                instanceId={selectId}
                options={options}
                defaultValue={options[0]}
                {...props}
            />
            <label
                htmlFor={1}
                className={`
                    absolute text-sm duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0]
                    text-blue-600 dark:text-blue-500
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                    peer-focus:scale-75 peer-focus:-translate-y-6
                `}
            >{label}</label>
        </div>
    )
}

export default StaticSelect
