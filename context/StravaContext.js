import React, { useEffect, useReducer } from "react";

const defaultState = {
  token: "",
  refreshToken: "",
  user: {}
};

const getDefaultState = () => {
  if (typeof window === "undefined") {
    return defaultState; // Return defaultState on the server-side
  }

  const token = sessionStorage.getItem("token");
  const refreshToken = sessionStorage.getItem("refreshToken");
  const user = sessionStorage.getItem("user");
  if (!!token && !!refreshToken && !!user) {
    return {
      token,
      refreshToken,
      user: JSON.parse(user)
    };
  }

  return defaultState;
};

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

const StravaStateContext = React.createContext(undefined);
const StravaDispatchContext = React.createContext(undefined);

const stravaReducer = (state, action) => {
  switch (action.type) {
    case "update_user_auth": {
      addUserToStorage(action.payload);
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        user: action.payload.user,
      };
    }
    default: {
      throw new Error(`Unhandled action: ${action}`);
    }
  }
};

const StravaContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(stravaReducer, getDefaultState());

  useEffect(() => {
    // This effect runs only on the client-side
    // and ensures that `sessionStorage` is available
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");
      const refreshToken = sessionStorage.getItem("refreshToken");
      const user = sessionStorage.getItem("user");
      if (!!token && !!refreshToken && !!user) {
        dispatch({
          type: "update_user_auth",
          payload: {
            token,
            refreshToken,
            user: JSON.parse(user)
          }
        });
      }
    }
  }, []);

  return (
    <StravaStateContext.Provider value={state}>
      <StravaDispatchContext.Provider value={dispatch}>
        {children}
      </StravaDispatchContext.Provider>
    </StravaStateContext.Provider>
  );
};

export { StravaContextProvider, StravaStateContext, StravaDispatchContext };
