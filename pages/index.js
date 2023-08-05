import React, { useContext, useEffect } from 'react';
import StravaAuthorize from '../components/StravaAutherize';
import { StravaStateContext } from "../context/StravaContext";
import { useRouter } from 'next/router';

const App = () => {
  const Router = useRouter();
  const stravaState = useContext(StravaStateContext);

  useEffect(() => {
    if (stravaState?.token) {
      const timeoutId = setTimeout(() => {
        Router.push('/home');
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [stravaState?.token, Router]);

  return (
    <>
      {!stravaState?.token ? (
        <div className='h-screen w-screen flex justify-center items-center'>
          <StravaAuthorize />
        </div>
      ) : (
        <p>Redirecting...</p>
      )}
    </>
  );
};

export default App;
