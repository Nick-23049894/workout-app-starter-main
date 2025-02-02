import { useState } from "react";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

function WorkoutDetails({ workout }) {
  const { dispatch } = useWorkoutContext();
  const { user } = useAuthContext();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(workout.title);
  const [load, setLoad] = useState(workout.load);
  const [reps, setReps] = useState(workout.reps);

  const handleDelete = async () => {
    if (!user) {
      alert("You must be logged in to delete workouts.");
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Delete failed: ${errorData.error}`);
      return;
    }

    const json = await response.json();
    dispatch({ type: "DELETE_WORKOUT", payload: json });

    alert("Workout deleted successfully!");
  };

  const handleEdit = async () => {
    if (!user) {
      alert("You must be logged in to edit workouts.");
      return;
    }

    const updatedWorkout = { title, load, reps };

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updatedWorkout),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Update failed: ${errorData.error}`);
      return;
    }

    const json = await response.json();
    dispatch({ type: "UPDATE_WORKOUT", payload: json });

    setIsEditing(false);
    alert("Workout updated successfully!");
  };

  return (
    <div className="workout-details">
      {isEditing ? (
        <div>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="number" value={load} onChange={(e) => setLoad(e.target.value)} />
          <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />

          <div className="button-group">
            <button onClick={handleEdit} className="save-btn">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          <h4>{workout.title}</h4>
          <p>
            <strong>Load (kg): </strong>
            {workout.load}
          </p>
          <p>
            <strong>Reps: </strong>
            {workout.reps}
          </p>
          <p>
            {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
          </p>

          <span className="material-symbols-outlined delete-icon" onClick={handleDelete}>
            delete
          </span>

          <div className="edit-button-container">
            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Workout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkoutDetails;
