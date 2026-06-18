import {createContext, useContext, useEffect, useState} from "react"
import api, { setCsrfToken as setInterceptorToken } from "../api/apiInterceptor"

const AppContext = createContext(null);

export const AppProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [btnLoading, setBtnLoading] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [csrfToken, setCsrfToken] = useState("")

    async function fetchUser () {
      try {
        setLoading(true);
        const {data} = await api.get(`api/v1/myProfile`);
        setUser(data)
        setIsAuth(true)
        
      } catch (error) {
        console.log(error); 
      } finally{
        setLoading(false);
      }
    }

    async function fetchCsrf () {
      try {
        const {data} = await api.get("/api/v1/csrfToken");
        setCsrfToken(data.csrfToken);
        console.log("Token received:", data.csrfToken)
        setInterceptorToken(data.csrfToken)
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
      const init = async () => {
        await fetchCsrf()  // ← wait for token to be stored first
        await fetchUser()  // ← then fetch user with token ready
      }
      init()
    }, [])
    

    return <AppContext.Provider value={{setIsAuth, isAuth, setUser, user, btnLoading, setBtnLoading, loading, setLoading, csrfToken, setCsrfToken, fetchUser }}>{children}</AppContext.Provider>
}


export const AppData = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("AppData must be used with in an AppProvider")
  }
  return context;
}

