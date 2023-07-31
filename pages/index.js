import React from 'react';

import StravaAuthorize from '../components/StravaAutherize';
import Strava from '../components/Strava/Strava'
import { StravaStateContext } from "../context/StravaContext";
import Sidebar from '../components/sidebar';


const App = () => {
  const stravaState = React.useContext(StravaStateContext);
  return (
    <>
      {!stravaState?.token ? <StravaAuthorize /> : <><Sidebar /><Strava /></>}
    </>
  )
}
export default App;
