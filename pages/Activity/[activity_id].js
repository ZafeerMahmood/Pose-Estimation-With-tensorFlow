


import React from 'react'
import { useEffect ,useState} from 'react'
import { getActivityById } from '../../api/strava'

const ActivitybyID = ({ token }) => {
    const [activity, setActivity] = useState({});
    useEffect(() => {
        const fetchActivityData = async () => {
          try {
            const activityData = await getActivityById(token.activity_id);
            console.log(activityData)
            setActivity(activityData);
          } catch (error) {
            console.error('Error fetching activity:', error);
          }
        };
    
        fetchActivityData();
      }, [token.activity_id]);

    return(
        <div>
            <h1>Activity</h1>
            <p>{activity.name}</p>
            <p>{activity.start_date}</p>
            <p>{activity.average_speed}</p>
        </div>
    )
}

export default ActivitybyID



export async function getServerSideProps({ params: token }) {

  console.log(token)
  return {
    props: { token },
  }
}