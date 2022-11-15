import React from 'react'
import {Navigate} from 'react-router-dom'
export const Protected = (Element) => {
    const isAuthenticated = localStorage.getItem('token')
  return (
    isAuthenticated ? <Element /> : <Navigate to='/'/>
  )
}
