'use client';
import AsyncSelect from 'react-select/async';
import { apiRequest } from '@/utils/api';
import { useId } from 'react';


const SearchableDropdown = ({ url, label, ...props }) => {
	//   const [isClearable, setIsClearable] = useState(true);
	//   const [isSearchable, setIsSearchable] = useState(true);
	//   const [isDisabled, setIsDisabled] = useState(false);
	// const [isLoading, setIsLoading] = useState(false);
	//   const [isRtl, setIsRtl] = useState(true);
  const selectId = useId();

	const loadOptions = (searchValue, callback) => {
		apiRequest(`${url}${searchValue}`, { method: 'GET' }).then((res) => 
			callback(
				res.results.map((obj) => ({
          value: obj.id,
          label: obj.name
        }))
			)
		)
	}

  return (
    <>
    <div className="relative z-0 w-full mb-5 group"> 
    <AsyncSelect
      instanceId={selectId} // This ensures consistent ID
      id={url}
      className="basic-single"
      classNamePrefix="select"
      // styles={{
      //   menuPortal: (base) => ({
      //     ...base,
      //     zIndex: 9999
      //   })
      // }}
      // styles={{
      //   menuPortal: (base) => ({
      //     ...base,
      //     zIndex: 9999
      //   })
      // }}
      menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
      // defaultValue={bearOptions[0]}
      isDisabled={false}
      // isLoading={isLoading}
      isClearable={true}
      // isRtl={true}
      isSearchable={true}
      // options={bearOptions}
      loadOptions={loadOptions}
      // onChange={handlechangeOption}
      {...props}
    />
    <label htmlFor={url} className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{label}</label>
    </div>
      {/* {isInvalid && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {error}
        </Form.Control.Feedback>
      )} */}

      {/* <div
    style={{
      color: 'hsl(0, 0%, 40%)',
      display: 'inline-block',
      fontSize: 12,
      fontStyle: 'italic',
      marginTop: '1em',
    }}
    >
    <Checkbox
      checked={isClearable}
      onChange={() => setIsClearable((state) => !state)}
    >
      Clearable
    </Checkbox>
    <Checkbox
      checked={isSearchable}
      onChange={() => setIsSearchable((state) => !state)}
    >
      Searchable
    </Checkbox>
    <Checkbox
      checked={isDisabled}
      onChange={() => setIsDisabled((state) => !state)}
    >
      Disabled
    </Checkbox>
    <Checkbox
      checked={isLoading}
      onChange={() => setIsLoading((state) => !state)}
    >
      Loading
    </Checkbox>
    <Checkbox checked={isRtl} onChange={() => setIsRtl((state) => !state)}>
      RTL
    </Checkbox>
    </div> */}
    </>
  );
}

export default SearchableDropdown;