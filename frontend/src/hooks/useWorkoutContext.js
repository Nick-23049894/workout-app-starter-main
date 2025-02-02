import { WorkoutContext } from "../context/WorkoutContext";
import { useContext } from "react";

// custom hook
export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext); // use the value passed in the provider

  if (!context) {
    throw Error(
      "useWorkoutContext must be used inside a WorkoutContextProvider"
    );
  }

  return context;
};
