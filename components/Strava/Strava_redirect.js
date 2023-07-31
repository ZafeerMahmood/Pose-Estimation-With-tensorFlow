import React, { useEffect, useContext } from 'react';
import { StravaDispatchContext, StravaStateContext } from "../../context/StravaContext";
import { fetchAuthorizedStravaUser } from "../../api/strava";
import { useRouter } from 'next/router';



const StravaRedirect = () => {
  const router = useRouter();
  const dispatch = useContext(StravaDispatchContext);
  const stravaState = useContext(StravaStateContext);

  useEffect(() => {
    const addUserToStorage = (payload) => {
        if (payload?.token) {
          sessionStorage.setItem("token", payload.token);
        }
        if (payload?.refreshToken) {
          sessionStorage.setItem("refreshToken", payload.refreshToken);
        }
        if (payload?.user) {
          sessionStorage.setItem("user", JSON.stringify(payload.user));
        }
      };
    const fetchAuthedUser = async (code) => {
      try {
        const response = await fetchAuthorizedStravaUser(code);
        if (response) {
          // Save user data to session storage
          addUserToStorage({
            token: response.access_token,
            refreshToken: response.refresh_token,
            user: response.athlete,
          });

          // Dispatch the action to update the state
          dispatch({
            type: "update_user_auth",
            payload: {
              token: response.access_token,
              refreshToken: response.refresh_token,
              user: response.athlete,
            }
          });
        }
      } catch (error) {
        console.error("Error handling Strava authentication:", error);
      }
    };

    if (!stravaState?.token) {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code") || "";
      fetchAuthedUser(code);
    }
  }, [dispatch, stravaState]);

  if (stravaState?.token) {
    router.push("/");
  }

  return <div>Handling Strava redirect...</div>;
};

export default StravaRedirect;
