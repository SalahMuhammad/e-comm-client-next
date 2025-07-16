// import { useActionState } from "react"
import { createUpdateRepository } from "../actions"


// obj in case of update 
function RepositoryForm({ obj }) {
    // console.log(55555, 'Params:', id, obj)
    //   const [state, action, pending] = useActionState(createPost, false)

    // const useActionState(createRepository, '')
  return (
        <form
            action={createUpdateRepository}
            className="max-w-md mx-auto"
            style={{ paddingTop: '1rem'}}
        // className="flex flex-col gap-4 p-4"
        >
            {obj?.id && (
                <input type="hidden" name="id" value={obj.id} />
            )}

            <div className="relative z-0 w-full mb-5 group">
                <input type="text" name="name" id="name" defaultValue={obj?.name} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Repository Name</label>
            </div>
            
            
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
    )
}

export default RepositoryForm
