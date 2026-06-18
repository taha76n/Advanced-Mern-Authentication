import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AppData } from '../context/AppContext'
import api from '../api/apiInterceptor'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const { user, setUser, setIsAuth, btnLoading, setBtnLoading } = AppData()
  const navigate = useNavigate()

  const logoutHandler = async () => {
    setBtnLoading(true)
    try {
      const { data } = await api.get("/api/v1/logout")
      toast.success(data.message)
      setUser(null)
      setIsAuth(false)
      navigate("/login")
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed")
    } finally {
      setBtnLoading(false)
    }
  }

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">

          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="text-2xl font-medium title-font text-gray-900">
              Welcome back, {user?.name}
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base mt-4">
              You are successfully logged in.
            </p>
          </div>

          <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col mx-auto">
            <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
              Your Profile
            </h2>

            <div className="relative mb-4">
              <label className="leading-7 text-sm text-gray-600">Name</label>
              <p className="w-full bg-white rounded border border-gray-300 text-base text-gray-700 py-1 px-3 leading-8">
                {user?.name}
              </p>
            </div>

            <div className="relative mb-4">
              <label className="leading-7 text-sm text-gray-600">Email</label>
              <p className="w-full bg-white rounded border border-gray-300 text-base text-gray-700 py-1 px-3 leading-8">
                {user?.email}
              </p>
            </div>

            <div className="relative mb-4">
              <label className="leading-7 text-sm text-gray-600">Role</label>
              <p className="w-full bg-white rounded border border-gray-300 text-base text-gray-700 py-1 px-3 leading-8">
                {user?.role}
              </p>
            </div>

            <button
              onClick={logoutHandler}
              disabled={btnLoading}
              className="text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {btnLoading ? "Logging out..." : "Logout"}
            </button>
          </div>

        </div>
      </section>
    </div>
  )
}

export default Dashboard