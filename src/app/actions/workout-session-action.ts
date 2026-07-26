"use server";
import { apiClient } from "./lib/api-client";

interface ISet {
  weight: number;
  reps: number;
}

export interface IExercise {
  exerciseName: string;
  sets: ISet[];
}

export async function createWorkoutSession(data: {
  userId: string;
  workoutSessionName: string;
  createDate: string;
  note: string;
  exercises: IExercise[];
}) {
  try {
    const res = await apiClient.post(
      `${process.env.API_URL}/WorkoutSession/workout-session`,
      {
        userId: data.userId,
        workoutSessionName: data.workoutSessionName,
        createDate: data.createDate,
        note: data.note,
        exercises: data.exercises,
      },
    );
    return {
      success: true,
      status: 200,
      message: "Workout session created successfully",
      data: res.data,
    };
  } catch (error: any) {
    // Return error object instead of throwing for better handling
    const status = error?.response?.status;
    let message = "Failed to create workout session. Please try again.";

    // Provide more specific error messages based on API error handling guide
    if (status === 401) {
      message = "Unauthorized. Please log in and try again.";
    } else if (status === 422) {
      // API returns plain text: "Invalid createDate format. Use yyyy/mm/dd"
      message =
        error?.response?.data || "Invalid date format. Please use yyyy/mm/dd.";
    } else if (status === 409) {
      message = "You already have a workout session on this date.";
    } else if (status === 404) {
      message = "User not found. Please log in again.";
    }

    return {
      success: false,
      status: status || 500,
      message: message,
    };
  }
}

export async function getAllWorkoutSessionsById(data: { userId: string }) {
  try {
    const res = await apiClient.get(
      `${process.env.API_URL}/WorkoutSession/workout-sessions/${data.userId}`,
    );

    return {
      success: true,
      status: 200,
      message: "Workout sessions retrieved successfully",
      data: res.data,
    };
  } catch (error: any) {
    // Return error object instead of throwing for better handling
    const status = error?.response?.status;
    let message = "Failed to retrieve workout sessions. Please try again.";

    // Provide more specific error messages based on API error handling guide
    if (status === 401) {
      message = "Unauthorized. Please log in and try again.";
    } else if (status === 404) {
      message = "User not found. Please log in again.";
    }

    return {
      success: false,
      status: status || 500,
      message: message,
    };
  }
}

export async function getWorkoutSessionById(data: {
  workoutSessionId: string;
}) {
  try {
    const res = await apiClient.get(
      `${process.env.API_URL}/WorkoutSession/workout-session/${data.workoutSessionId}`,
    );

    return {
      success: true,
      status: 200,
      message: "Workout session retrieved successfully",
      data: res.data,
    };
  } catch (error: any) {
    // Return error object instead of throwing for better handling
    const status = error?.response?.status;
    let message = "Failed to retrieve workout session. Please try again.";

    // Provide more specific error messages based on API error handling guide
    if (status === 401) {
      message = "Unauthorized. Please log in and try again.";
    } else if (status === 404) {
      message = "Workout session not found.";
    }

    return {
      success: false,
      status: status || 500,
      message: message,
    };
  }
}

export async function getWorkoutCalendar(data: {
  userId: string;
  month: number;
  year: number;
}) {
  try {
    const res = await apiClient.get(
      `${process.env.API_URL}/WorkoutSession/workout-calendar/${data.userId}/${data.month}/${data.year}`,
    );

    return {
      success: true,
      status: 200,
      message: "Workout calendar retrieved successfully",
      data: res.data,
    };
  } catch (error: any) {
    // Return error object instead of throwing for better handling
    const status = error?.response?.status;
    let message = "Failed to retrieve workout calendar. Please try again.";

    // Provide more specific error messages based on API error handling guide
    if (status === 401) {
      message = "Unauthorized. Please log in and try again.";
    } else if (status === 404) {
      message = "User not found. Please log in again.";
    } else if (status === 422) {
      // API returns plain text: "Cannot request months outside the valid range"
      message =
        error?.response?.data ||
        "Cannot request months outside the valid range.";
    }

    return {
      success: false,
      status: status || 500,
      message: message,
    };
  }
}

export async function updateWorkoutSession(data: {
  workoutSessionId: string;
  workoutSessionName: string;
  note: string;
  exercises: IExercise[];
}) {
  try {
    const res = await apiClient.put(
      `${process.env.API_URL}/WorkoutSession/workout-session`,
      {
        workoutSessionId: data.workoutSessionId,
        workoutSessionName: data.workoutSessionName,
        note: data.note,
        exercises: data.exercises,
      },
    );
    return {
      success: true,
      status: 200,
      message: "Workout session updated successfully",
      data: res.data,
    };
  } catch (error: any) {
    // Return error object instead of throwing for better handling
    const status = error?.response?.status;
    let message = "Failed to update workout session. Please try again.";

    // Provide more specific error messages based on API error handling guide
    if (status === 401) {
      message = "Unauthorized. Please log in and try again.";
    } else if (status === 404) {
      // The update is wrapped in a database transaction — all changes are rolled back
      // Possible causes: session, exercise, or set not found
      message = "Data may be stale. Please refresh the page and try again.";
    }

    return {
      success: false,
      status: status || 500,
      message: message,
    };
  }
}
