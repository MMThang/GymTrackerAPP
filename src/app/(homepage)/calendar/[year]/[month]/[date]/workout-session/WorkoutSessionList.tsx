"use client";
import { getSession } from "@/app/actions/user-actions";
import {
  getAllWorkoutSessionsById,
  getWorkoutSessionById,
} from "@/app/actions/workout-session-action";
import { Button } from "@/app/components/buttons/button";
import { Icons } from "@/app/components/icons";
import { WorkoutSessionFormHandle } from "./WorkoutSessionForm";
import { useEffect, useState, useRef } from "react";

interface WorkoutSession {
  workoutSessionId: string;
  workoutSessionName: string;
  numberOfExercises: number;
  numberOfSets: number;
  createDate: string;
  note?: string;
}

export default function WorkoutSessionList({
  formRef,
  workoutSessionIdFromParam,
}: {
  formRef: React.RefObject<WorkoutSessionFormHandle | null>;
  workoutSessionIdFromParam: string;
}) {
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    async function fetchData() {
      try {
        const user = await getSession();
        const result = await getAllWorkoutSessionsById({ userId: user.sid });

        if (!result.success) {
          setErrorMessage(result.message || "Failed to load workout sessions");
          return;
        }

        setWorkoutSessions(result.data || []);
      } catch {
        setErrorMessage("An unexpected error occurred in WorkoutSessionList");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleViewDetails(workoutSessionId: string) {
    const result = await getWorkoutSessionById({ workoutSessionId });
    if (result.success && result.data) {
      formRef.current?.loadSession({
        workoutSessionId: workoutSessionIdFromParam,
        workoutSessionName: result.data.workoutSessionName || "",
        note: result.data.notes || "",
        createDate: result.data.createDate || "",
        exercises: (result.data.exercises || []).map((ex: any) => ({
          exerciseName: ex.exerciseName || "",
          sets: (ex.sets || []).map((s: any) => ({
            weight: s.weight || 0,
            reps: s.reps || 0,
            isBodyWeight: s.isBodyWeight || false,
          })),
        })),
      } as any);
    }
  }

  if (loading) {
    return (
      <div className="workout-session-list">
        <div className="workout-session-list-header">
          <h2>Recent Workout Sessions</h2>
          <p className="loading-message">Loading...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="workout-session-list">
        <div className="workout-session-list-header">
          <h2>Recent Workout Sessions</h2>
          <p className="error-message">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="workout-session-list">
      <div className="workout-session-list-header">
        <div className="header-content">
          <h2>Recent Workout Sessions</h2>
          <span className="session-count">
            {workoutSessions.length} sessions
          </span>
        </div>
        <p className="header-subtitle">Last 7 days of training</p>
      </div>

      <div className="sessions-container">
        {workoutSessions.length === 0 ? (
          <div className="empty-message">
            No session found, create a workout
          </div>
        ) : (
          workoutSessions.map((session) => {
            return (
              <div
                key={session.workoutSessionId}
                className="workout-session-card"
              >
                <div className="card-header">
                  <div className="workout-session-name">
                    {session.workoutSessionName}
                  </div>
                  <div className="workout-session-date">
                    {session.createDate}
                  </div>
                </div>

                <div className="card-stats">
                  <div className="stat-items">
                    <div className="stat-item">
                      <span className="stat-value">
                        {session.numberOfExercises}
                      </span>
                      <span className="stat-label">Exercise(s)</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{session.numberOfSets}</span>
                      <span className="stat-label">Set(s)</span>
                    </div>
                  </div>
                  <Button
                    btnType="button"
                    type="button"
                    onClick={() => handleViewDetails(session.workoutSessionId)}
                    p="View Details"
                    className="view-details-btn"
                  />
                </div>

                {session.note && (
                  <div className="card-note">
                    <div className="note-icon">
                      <Icons.EditNote />
                    </div>
                    <span>{session.note}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
