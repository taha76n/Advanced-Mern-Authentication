import React from 'react'
import { Navigate } from 'react-router-dom'
import { AppData } from '../context/AppContext'

const PrivateRoute = ({ children }) => {
  const { isAuth, loading } = AppData()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return isAuth ? children : <Navigate to="/login" replace />
}

export default PrivateRoute