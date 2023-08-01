import '../styles/globals.css'
import { StravaContextProvider } from "../context/StravaContext";
import { ToastContainer, toast } from "react-toastify";
function MyApp({ Component, pageProps }) {

  return(
    <StravaContextProvider>
      <Component {...pageProps} />
      <ToastContainer/>
    </StravaContextProvider>
  ) 
}

export default MyApp
