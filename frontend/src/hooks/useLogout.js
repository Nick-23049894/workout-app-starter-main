import { useAuthContext } from "./useAuthContext";
import { useWorkoutContext } from "./useWorkoutContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: dispatchWorkouts } = useWorkoutContext();
  const logout = () => {
    // remove user from local storage
    localStorage.removeItem("user");

    // dispatch logout action, remove user from auth context
    dispatch({ type: "LOGOUT" });

    // remove workouts from context
    dispatchWorkouts({ type: "SET_WORKOUTS", payload: null });
  };

  return { logout };
};
