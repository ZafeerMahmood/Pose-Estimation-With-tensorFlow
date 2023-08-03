import React from 'react';

import StravaAuthorize from '../components/StravaAutherize';
import { StravaStateContext } from "../context/StravaContext";
import { useRouter } from 'next/router';


const App = () => {
  const Router = useRouter();
  const stravaState = React.useContext(StravaStateContext);
  return (
    <>
      {!stravaState?.token ? <div className='h-screen w-screen flex justify-center items-center' ><StravaAuthorize /></div> : Router.push('/home')}
    </>
  )
}
export default App;
