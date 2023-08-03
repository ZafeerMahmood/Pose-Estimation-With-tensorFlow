import React from 'react'
import Sidebar from '../components/sidebar'
import List from '../components/list'
import { getUserActivities } from '../api/strava'
import { StravaStateContext } from "../context/StravaContext";

function Activities() {

    const [activities, setActivities] = React.useState([]);
    const stravaState = React.useContext(StravaStateContext);
    const user = stravaState?.user;
    const fullname = `${user?.firstname} ${user?.lastname}`;

    React.useEffect(() => {
        let isMounted = true;
        const fetchActivities = async () => {
            const response = await getUserActivities(fullname);
            console.log(response[0]._id.$oid)
            if (isMounted && response) {
                setActivities(response);
            }
        };
        if (stravaState?.token) {
            fetchActivities();
        }
        
        return () => {
            isMounted = false;
        };
    }, [stravaState?.token]);
    return (


        <div className='h-screen w-screen'>
            <Sidebar />
            <div className='h-full w-full flex flex-col justify-start items-center space-y-4'>
                <h4 className="  text-3xl md:text-5xl font-extrabold dark:text-black mb-6 "> List of Activites</h4>
                {activities.map((activitie, index) => {
                    return (
                        <a href={`Activity/${activitie._id.$oid}`} key={index} className='flex hover:bg-gray-700 hover:text-white p-2 rounded-lg h-14 w-5/6'>
                            <span className='flex flex-row space-x-4 text-lg font-bold'>
                                <h1 className='text-bold '>{activitie.name} </h1>{" "}
                                <p> {activitie.start_date} </p>
                            </span>
                        </a>
                    )
                })}
            </div>
        </div>
    )
}

export default Activities