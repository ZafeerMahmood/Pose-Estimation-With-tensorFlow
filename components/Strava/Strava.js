import React from "react";

import StravaActivity from "./StravaActivity";
import StravaActivityDetail from "./StravaActivityDetails";
import StravaUser from "../StravaUser";

import { fetchUserStravaActivities } from "../../api/strava";
import { StravaStateContext } from "../../context/StravaContext";

const Strava = () => {
  const [activities, setActivities] = React.useState([]);
  const [selectedActivityIndex, setSelectedActivityIndex] = React.useState(0);
  const stravaState = React.useContext(StravaStateContext);

  React.useEffect(() => {
    let isMounted = true;

    const fetchActivities = async () => {
      const response = await fetchUserStravaActivities(stravaState?.token);
      if (isMounted && response) {
        setActivities(response);
      }
    };

    if (stravaState?.token) {
      fetchActivities();
    }
    // useEffect cleanup
    return () => {
      isMounted = false;
    };
  }, [stravaState?.token]);

  const handleSelectActivity = (id) => {
    const selectedActivityIndex = activities.findIndex((activity) => activity.id === id);
    setSelectedActivityIndex(selectedActivityIndex);
  };


  const activeActivity = activities[selectedActivityIndex];
  const activityDetailProps = {
    name: activeActivity?.name,
    start_date: activeActivity?.start_date,
    distance: activeActivity?.distance,
    elapsed_time: activeActivity?.elapsed_time,
    map: activeActivity?.map,
  };

  return (
    <div className="grid grid-cols-1 bg-[#fff]">
      <StravaUser />
      <div className="flex flex-col ">
        {activities.map((item, index) => {
          const isSelected = selectedActivityIndex === index;
          return (
            <StravaActivity
              key={item.id}
              id={item.id}
              name={item.name}
              start_date={item.start_date}
              selectActivity={handleSelectActivity}
              isSelected={isSelected}
            />
          );
        })}
      </div>
      {activeActivity ? <StravaActivityDetail {...activityDetailProps} /> : null}
    </div>
  );
};

export default Strava;
