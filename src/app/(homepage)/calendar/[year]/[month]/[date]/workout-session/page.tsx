"use client";
import { useRef, use, useEffect, useState } from "react";
import WorkoutSessionForm, {
  WorkoutSessionFormHandle,
} from "./WorkoutSessionForm";
import WorkoutSessionList from "./WorkoutSessionList";
import { getSession } from "@/app/actions/user-actions";
import {
  getWorkoutCalendar,
  getWorkoutSessionById,
} from "@/app/actions/workout-session-action";
import { Icons } from "@/app/components/icons";
import { dayLookup } from "@/app/utils/utils";

interface CalendarProps {
  year: number;
  month: number;
  date: number;
}

export default function WorkoutSession({
  params,
}: {
  params: Promise<CalendarProps>;
}) {
  const formRef = useRef<WorkoutSessionFormHandle>(null);
  const resolvedParams = use(params);
  const loaded = useRef(false);
  const [loading, setLoading] = useState(true);
  const workoutSessionIdRef = useRef<string>("");
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    async function loadExistingSession() {
      try {
        const user = await getSession();
        const calendarResult = await getWorkoutCalendar({
          userId: user.sid,
          month: resolvedParams.month,
          year: resolvedParams.year,
        });

        if (!calendarResult.success || !calendarResult.data) {
          setLoading(false);
          return;
        }

        const dayDictionary = dayLookup(calendarResult.data);

        const dayData = dayDictionary[resolvedParams.date];

        if (!dayData?.hasWorkoutSession || !dayData.workoutSessionId) {
          setLoading(false);
          return;
        }

        workoutSessionIdRef.current = dayData.workoutSessionId;

        const sessionResult = await getWorkoutSessionById({
          workoutSessionId: workoutSessionIdRef.current,
        });

        if (sessionResult.success && sessionResult.data) {
          formRef.current?.loadSession({
            workoutSessionId: workoutSessionIdRef.current ?? "",
            workoutSessionName: sessionResult.data.workoutSessionName || "",
            note: sessionResult.data.notes || "",
            createDate: sessionResult.data.createDate || "",
            exercises: (sessionResult.data.exercises || []).map((ex: any) => ({
              exerciseId: ex.exerciseId,
              exerciseName: ex.exerciseName || "",
              sets: (ex.sets || []).map((s: any) => ({
                setId: s.setId || "",
                weight: s.weight || 0,
                reps: s.reps || 0,
                isBodyWeight: s.isBodyWeight || false,
              })),
            })),
          });
        }
      } catch (err) {
        // Silently fail - form stays with default empty state
      } finally {
        setLoading(false);
      }
    }

    loadExistingSession();
  }, []);

  return (
    <div className="workout-session">
      <div className="auth-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      {/* Toggle button for mobile/tablet */}
      <button
        className="workout-session-toggle-btn"
        onClick={() => setShowList((prev) => !prev)}
      >
        {showList ? (
          <>
            <Icons.ChevronRight />
            <span>Hide History</span>
          </>
        ) : (
          <>
            <Icons.ChevronLeft />
            <span>View History</span>
          </>
        )}
      </button>

      <WorkoutSessionForm ref={formRef} param={params} loading={loading} />

      {/* Overlay backdrop on mobile/tablet */}
      {showList && (
        <div
          className="workout-session-overlay"
          onClick={() => setShowList(false)}
        />
      )}

      <div className={`workout-session-list-wrapper ${showList ? "open" : ""}`}>
        <WorkoutSessionList
          formRef={formRef}
          workoutSessionIdFromParam={workoutSessionIdRef.current}
        />
      </div>
    </div>
  );
}
