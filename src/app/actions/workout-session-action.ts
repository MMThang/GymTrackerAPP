"use server";
import { apiClient } from "./lib/api-client";

// Server-side error logging utility
function logServerError(error: any, context: string, data?: any) {
  // Log to server console (visible in terminal/Next.js dev output)
  console.error(`[Server Error] ${context}:`, {
    message: error?.message || "Unknown error",
    status: error?.response?.status || error?.status,
    data: error?.response?.data,
    config: error?.config,
    timestamp: new Date().toISOString(),
    requestData: data,
  });

  // Return error info to be logged on client
  return {
    serverMessage: error?.response?.data?.message || error?.message,
    serverStatus: error?.response?.status,
    serverData: error?.response?.data,
  };
}

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
      status: "200",
      message: "Workout session created successfully",
      data: res.data,
    };
  } catch (error: any) {
    // Log error to server console for debugging
    const errorDetails = logServerError(error, "Create Workout Session", {
      userId: data.userId,
      workoutSessionName: data.workoutSessionName,
      exerciseCount: data.exercises?.length,
    });

    // Return error object instead of throwing for better handling
    const status = error?.response?.status;
    let message = "Failed to create workout session. Please try again.";

    // Provide more specific error messages based on status code
    if (status === 400) {
      message =
        error?.response?.data?.message ||
        "Invalid workout session data. Please check your input.";
    } else if (status === 401) {
      message = "Unauthorized. Please log in and try again.";
    } else if (status === 403) {
      message =
        "Access denied. You don't have permission to create workout sessions.";
    } else if (status === 409) {
      message =
        "Workout session name already exists. Please choose a different name.";
    } else if (status === 422) {
      message = "Workout session validation failed. Please check your input.";
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    }

    // Return detailed error info for client-side logging
    return {
      success: false,
      status: status?.toString() || "500",
      message: message,
      debugInfo: errorDetails, // Include debug info for client logging
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
      status: "200",
      message: "Workout sessions retrieved successfully",
      data: res.data,
    };
  } catch (error: any) {
    // Log error to server console for debugging
    const errorDetails = logServerError(error, "Get Workout Sessions", {
      userId: data.userId,
    });

    // Return error object instead of throwing for better handling
    const status = error?.response?.status;
    let message = "Failed to retrieve workout sessions. Please try again.";

    // Provide more specific error messages based on status code
    if (status === 400) {
      message =
        error?.response?.data?.message ||
        "Invalid user ID. Please check your input.";
    } else if (status === 401) {
      message = "Unauthorized. Please log in and try again.";
    } else if (status === 403) {
      message =
        "Access denied. You don't have permission to view workout sessions.";
    } else if (status === 404) {
      message = "No workout sessions found for this user.";
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    }

    // Return detailed error info for client-side logging
    return {
      success: false,
      status: status?.toString() || "500",
      message: message,
      debugInfo: errorDetails, // Include debug info for client logging
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
      status: "200",
      message: "Workout session retrieved successfully",
      data: res.data,
    };
  } catch (error: any) {
    // Log error to server console for debugging
    const errorDetails = logServerError(error, "Get Workout Session", {
      workoutSessionId: data.workoutSessionId,
    });

    // Return error object instead of throwing for better handling
    const status = error?.response?.status;
    let message = "Failed to retrieve workout session. Please try again.";

    // Provide more specific error messages based on status code
    if (status === 400) {
      message =
        error?.response?.data?.message ||
        "Invalid workout session ID. Please check your input.";
    } else if (status === 401) {
      message = "Unauthorized. Please log in and try again.";
    } else if (status === 403) {
      message =
        "Access denied. You don't have permission to view this workout session.";
    } else if (status === 404) {
      message = "Workout session not found.";
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    }

    // Return detailed error info for client-side logging
    return {
      success: false,
      status: status?.toString() || "500",
      message: message,
      debugInfo: errorDetails, // Include debug info for client logging
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
      status: "200",
      message: "Workout calendar retrieved successfully",
      data: res.data,
    };
  } catch (error: any) {
    // Log error to server console for debugging
    const errorDetails = logServerError(error, "Get Workout Calendar", {
      userId: data.userId,
      month: data.month,
      year: data.year,
    });

    // Return error object instead of throwing for better handling
    const status = error?.response?.status;
    let message = "Failed to retrieve workout calendar. Please try again.";

    // Provide more specific error messages based on status code
    if (status === 400) {
      message =
        error?.response?.data?.message ||
        "Invalid calendar parameters. Please check your input.";
    } else if (status === 401) {
      message = "Unauthorized. Please log in and try again.";
    } else if (status === 403) {
      message =
        "Access denied. You don't have permission to view this calendar.";
    } else if (status === 404) {
      message = "No calendar data found for this month/year.";
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    }

    // Return detailed error info for client-side logging
    return {
      success: false,
      status: status?.toString() || "500",
      message: message,
      debugInfo: errorDetails, // Include debug info for client logging
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
      status: "200",
      message: "Workout session updated successfully",
      data: res.data,
    };
  } catch (error: any) {
    // Log error to server console for debugging
    const errorDetails = logServerError(error, "Update Workout Session", {
      workoutSessionId: data.workoutSessionId,
      workoutSessionName: data.workoutSessionName,
      exerciseCount: data.exercises?.length,
    });

    // Return error object instead of throwing for better handling
    const status = error?.response?.status;
    let message = "Failed to update workout session. Please try again.";

    // Provide more specific error messages based on status code
    if (status === 400) {
      message =
        error?.response?.data?.message ||
        "Invalid workout session data. Please check your input.";
    } else if (status === 401) {
      message = "Unauthorized. Please log in and try again.";
    } else if (status === 403) {
      message =
        "Access denied. You don't have permission to update workout sessions.";
    } else if (status === 422) {
      message = "Workout session validation failed. Please check your input.";
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    }

    // Return detailed error info for client-side logging
    return {
      success: false,
      status: status?.toString() || "500",
      message: message,
      debugInfo: errorDetails, // Include debug info for client logging
    };
  }
}
