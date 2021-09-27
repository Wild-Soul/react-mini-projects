import React from 'react'
import { useGlobalContext } from './context'

export const Buttons = () => {
  const { isLoading, page, totalPages, handlePage } = useGlobalContext();

  return <div className="btn-container">
    <button disabled={isLoading} onClick={() => handlePage('dec')}>
      prev
    </button>
    <p>{page} of {totalPages}</p>
    <button disabled={isLoading} onClick={() => handlePage('inc')}>
      next
    </button>
  </div>
}
