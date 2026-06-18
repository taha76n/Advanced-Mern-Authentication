import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api/apiInterceptor'

const Verify = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState(true)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data } = await api.post(`/api/v1/verify/${token}`)
        setMessage(data.message)
        setSuccess(true)
        toast.success(data.message)
        setTimeout(() => navigate("/login"), 3000)
      } catch (error) {
        const errMsg = error.response?.data?.message || "Verification failed"
        setMessage(errMsg)
        setSuccess(false)
        toast.error(errMsg)
      } finally {
        setVerifying(false)
      }
    }

    if (token) {
      verifyEmail()
    } else {
      setMessage("Invalid verification link")
      setSuccess(false)
      setVerifying(false)
    }
  }, [token])

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto flex flex-wrap items-center justify-center">
          <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center text-center w-full max-w-md">

            {verifying && (
              <>
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <h2 className="text-gray-900 text-lg font-medium title-font">
                  Verifying your email...
                </h2>
                <p className="leading-relaxed mt-2 text-sm">
                  Please wait while we confirm your account.
                </p>
              </>
            )}

            {!verifying && success && (
              <>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-gray-900 text-lg font-medium title-font">
                  Email Verified!
                </h2>
                <p className="leading-relaxed mt-2 text-sm">{message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Redirecting you to login in 3 seconds...
                </p>
              </>
            )}

            {!verifying && !success && (
              <>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-gray-900 text-lg font-medium title-font">
                  Verification Failed
                </h2>
                <p className="leading-relaxed mt-2 text-sm">{message}</p>
                <button
                  onClick={() => navigate("/register")}
                  className="mt-4 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                >
                  Back to Register
                </button>
              </>
            )}

          </div>
        </div>
      </section>
    </div>
  )
}

export default Verify
