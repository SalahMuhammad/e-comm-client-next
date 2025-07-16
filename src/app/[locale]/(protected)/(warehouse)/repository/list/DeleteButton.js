'use client'


import { deleteRepository } from '../actions';

function DeleteButton({ id }) {
  return (
    <button 
        className={`font-medium text-red-600 dark:text-red-500 hover:underline ms-3 cursor-pointer`}
        onClick={() => deleteRepository(id)
    }>
        Remove
    </button>
  )
}

export default DeleteButton
