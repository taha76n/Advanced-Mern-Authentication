import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api/apiInterceptor'
// import { AppData } from '../context/AppContext'  // ← add this import


const VerifyOtp = () => {
  // const { fetchUser } = AppData() 
  const [otp, setOtp] = useState("")
  const [btnLoading, setBtnLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email

  useEffect(() => {
    if (!email) {
      toast.error("Please login first")
      navigate("/login")
    }
  }, [email])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setBtnLoading(true)
    try {
      const { data } = await api.post(
        `/api/v1/verify`,
        { email, otp },
        { withCredentials: true }
      )
      toast.success(data.message)
      navigate("/dashboard")
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed")
    } finally {
      setBtnLoading(false)
    }
  }

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
          <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
            <h1 className="title-font font-medium text-3xl text-gray-900">
              One last step to get in
            </h1>
            <p className="leading-relaxed mt-4">
              We sent a 6-digit OTP to <strong>{email}</strong>. Enter it below
              to complete your login. It expires in 5 minutes.
            </p>
          </div>
          <form
            onSubmit={onSubmitHandler}
            className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0"
          >
            <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
              Enter OTP
            </h2>

            <div className="relative mb-4">
              <label htmlFor="otp" className="leading-7 text-sm text-gray-600">
                6-digit code
              </label>
              <input
                type="number"
                id="otp"
                name="otp"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <button
              className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={btnLoading}
            >
              {btnLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <Link to="/login" className="text-xs text-gray-500 mt-3">
              Back to login
            </Link>
          </form>
        </div>
      </section>
    </div>
  )
}

export default VerifyOtp