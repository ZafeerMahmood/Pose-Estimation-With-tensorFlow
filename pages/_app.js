import '../styles/globals.css'
import { StravaContextProvider } from "../context/StravaContext";
function MyApp({ Component, pageProps }) {

  return(
    <StravaContextProvider>
      <Component {...pageProps} />
    </StravaContextProvider>
  ) 
}

export default MyApp
