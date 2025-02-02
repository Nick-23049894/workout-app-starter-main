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
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_WORKOUT", payload: json });
    }
  };

  const handleEdit = async () => {
    if (!user) {
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

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_WORKOUT", payload: json });
      setIsEditing(false);
    }
  };

  return (
    <div className="workout-details">
      {isEditing ? (
        <div>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="number" value={load} onChange={(e) => setLoad(e.target.value)} />
          <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />

          {/* Buttons container with flexbox */}
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

          {/* Icons container with flexbox */}
          <div className="icon-group">
            <span className="material-symbols-outlined delete-icon" onClick={handleDelete}>
              delete
            </span>
            <span className="material-symbols-outlined edit-icon" onClick={() => setIsEditing(true)}>
              edit
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkoutDetails;
