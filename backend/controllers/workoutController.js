const Workout = require("../models/workoutModel");
const mongoose = require("mongoose");

// Get all workouts
const getWorkouts = async (req, res) => {
  try {
    const user_id = req.user._id;
    const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single workout
const getWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid workout ID" });
  }

  const workout = await Workout.findById(id);
  if (!workout) {
    return res.status(404).json({ error: "Workout not found" });
  }

  res.status(200).json(workout);
};

// Create a new workout
const createWorkout = async (req, res) => {
  const { title, reps, load } = req.body;
  const user_id = req.user._id;

  let emptyFields = [];
  if (!title) emptyFields.push("title");
  if (!reps) emptyFields.push("reps");
  if (!load) emptyFields.push("load");

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all fields", emptyFields });
  }

  try {
    const workout = await Workout.create({ title, reps, load, user_id });
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid workout ID" });
  }

  try {
    const workout = await Workout.findOneAndDelete({ _id: id, user_id: req.user._id });

    if (!workout) {
      return res.status(404).json({ error: "Workout not found or unauthorized" });
    }

    res.status(200).json({ message: "Workout deleted successfully", workout });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete workout" });
  }
};

// Update a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid workout ID" });
  }

  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: id, user_id: req.user._id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!workout) {
      return res.status(404).json({ error: "Workout not found or unauthorized" });
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ error: "Failed to update workout" });
  }
};

module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout,
};
