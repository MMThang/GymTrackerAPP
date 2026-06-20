"use client";
import { use, forwardRef, useImperativeHandle, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Sets from "./Sets";
import { Icons } from "@/app/components/icons";
import { useUser } from "@/app/context-provider";
import {
  createWorkoutSession,
  updateWorkoutSession,
} from "@/app/actions/workout-session-action";

interface CalendarProps {
  year: number;
  month: number;
  date: number;
}

export interface CreateWorkoutSessionFormData {
  userId: string;
  workoutSessionName: string;
  note?: string;
  createDate: string;
  exercises: {
    exerciseName: string;
    sets: { weight: number; reps: number; isBodyWeight?: boolean }[];
  }[];
}

export interface UpdateWorkoutSessionFormData {
  workoutSessionId: string;
  workoutSessionName: string;
  note?: string;
  exercises: {
    exerciseId: string | null;
    exerciseName: string;
    sets: {
      setId: string;
      weight: number;
      reps: number;
      isBodyWeight?: boolean;
    }[];
  }[];
}

export type WorkoutSessionFormData =
  | CreateWorkoutSessionFormData
  | UpdateWorkoutSessionFormData;

export interface WorkoutSessionFormHandle {
  loadSession: (data: WorkoutSessionFormData) => void;
}

const WorkoutSessionForm = forwardRef<
  WorkoutSessionFormHandle,
  { param: Promise<CalendarProps>; loading?: boolean }
>(function WorkoutSessionForm({ param, loading }, ref) {
  const { userPromise } = useUser();
  const userData = use(userPromise);
  const resolvePaprams = use(param);

  // Format date to only include date, month, year (no time)
  const formatDateForSubmission = () => {
    const date = resolvePaprams.date;
    const month = resolvePaprams.month;
    const year = resolvePaprams.year;
    return `${year}/${month.toString().padStart(2, "0")}/${date.toString().padStart(2, "0")}`;
  };

  interface ExerciseField {
    exerciseId: string | null;
    exerciseName: string;
    sets: {
      setId: string | null;
      weight: number;
      reps: number;
      isBodyWeight?: boolean;
    }[];
  }

  interface FormValues {
    userId: string;
    workoutSessionId: string | null;
    workoutSessionName: string;
    exercises: ExerciseField[];
    createDate: string | null;
    note: string;
  }

  const { control, register, handleSubmit, watch, reset } = useForm<FormValues>(
    {
      defaultValues: {
        userId: userData.sid,
        workoutSessionId: null as string | null,
        workoutSessionName: "",
        exercises: [
          {
            exerciseId: null,
            exerciseName: "",
            sets: [{ weight: 0, reps: 0, isBodyWeight: false }],
          },
        ],
        createDate: formatDateForSubmission() || null,
        note: "",
      },
    },
  );
  const {
    fields: exercises,
    append,
    remove,
  } = useFieldArray<FormValues>({
    control,
    name: "exercises",
  });

  // Expose loadSession method to parent
  useImperativeHandle(ref, () => ({
    loadSession: (data: WorkoutSessionFormData) => {
      if (!("workoutSessionId" in data)) {
        // TypeScript narrows to CreateWorkoutSessionFormData
        reset({
          userId: userData.sid,
          workoutSessionName: data.workoutSessionName || "",
          exercises: data.exercises?.length
            ? data.exercises.map((ex) => ({
                exerciseName: ex.exerciseName,
                sets: ex.sets?.length
                  ? ex.sets.map((s) => ({
                      weight: s.weight || 0,
                      reps: s.reps || 0,
                      isBodyWeight: s.isBodyWeight || false,
                    }))
                  : [{ weight: 0, reps: 0 }],
              }))
            : [
                {
                  exerciseId: null as string | null,
                  exerciseName: "",
                  sets: [{ weight: 0, reps: 0, isBodyWeight: false }],
                },
              ],
          createDate: data.createDate || formatDateForSubmission(),
          note: data.note || "",
        });
      } else {
        // TypeScript narrows to UpdateWorkoutSessionFormData
        reset({
          workoutSessionId: data.workoutSessionId,
          workoutSessionName: data.workoutSessionName || "",
          exercises: data.exercises?.length
            ? data.exercises.map((ex) => ({
                exerciseId: ex.exerciseId ?? null,
                exerciseName: ex.exerciseName,
                sets: ex.sets?.length
                  ? ex.sets.map((s) => ({
                      weight: s.weight || 0,
                      reps: s.reps || 0,
                      isBodyWeight: s.isBodyWeight || false,
                    }))
                  : [{ weight: 0, reps: 0 }],
              }))
            : [
                {
                  exerciseId: null as string | null,
                  exerciseName: "",
                  sets: [{ weight: 0, reps: 0, isBodyWeight: false }],
                },
              ],
          note: data.note || "",
        });
      }
    },
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (data.workoutSessionId) {
        const result = await updateWorkoutSession({
          workoutSessionId: data.workoutSessionId,
          workoutSessionName: data.workoutSessionName,
          note: data.note || "",
          exercises: data.exercises,
        });
        if (result.success) {
          toast.success("Workout session updated successfully!");
        } else {
          toast.error(result.message || "Failed to update workout session");
        }
      } else {
        const result = await createWorkoutSession({
          userId: data.userId,
          workoutSessionName: data.workoutSessionName,
          createDate: data.createDate || formatDateForSubmission(),
          note: data.note || "",
          exercises: data.exercises,
        });
        if (result.success) {
          toast.success("Workout session created successfully!");
        } else {
          toast.error(result.message || "Failed to create workout session");
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="workout-session-form-container">
      <div className={`workout-session-form`}>
        <div className="workout-session-form-card">
          <div className="form-header">
            <div className="form-icon">
              <Icons.Note />
            </div>
            <h2>
              {watch("workoutSessionId")
                ? "Update Workout Session"
                : "Create Workout Session"}
            </h2>
            <div className="form-date-badge">
              {new Date(
                resolvePaprams.year,
                resolvePaprams.month - 1,
                resolvePaprams.date,
              ).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <p>Design your custom workout routine</p>
          </div>

          {loading ? (
            <div className="form-loading">
              <Icons.Spinner />
              <span>Loading workout session...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit(submit)} className="form">
              <input type="hidden" {...register("userId")} />
              <input type="hidden" {...register("workoutSessionId")} />

              <div className="input-group">
                <label htmlFor="workoutSessionName">Workout Session Name</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <Icons.House />
                  </div>
                  <input
                    {...register("workoutSessionName", { required: true })}
                    id="workoutSessionName"
                    placeholder="e.g., Upper Body Day"
                    className="workout-session-name-input"
                  />
                </div>
              </div>

              <div className="exercises-section">
                <div className="section-header">
                  <h3>Exercises</h3>
                  <span className="exercise-count">
                    {exercises.length} exercise(s)
                  </span>
                </div>

                <div className="exercises-list">
                  {exercises.map((exercise, index) => (
                    <section key={exercise.id} className="exercise-card">
                      <div className="exercise-header">
                        <span className="exercise-number">{index + 1}</span>
                        <div className="exercise-name-wrapper">
                          <input
                            placeholder="Exercise name (e.g., Bench Press)"
                            {...register(`exercises.${index}.exerciseName`, {
                              required: true,
                            })}
                            className="exercise-name-input"
                          />
                        </div>
                        <button
                          type="button"
                          className="remove-exercise-btn"
                          onClick={() => remove(index)}
                          title="Remove exercise"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                      <Sets
                        nestIndex={index}
                        {...{ control, register, watch }}
                      />
                    </section>
                  ))}
                </div>

                <button
                  className="add-exercise-btn"
                  type="button"
                  onClick={() => {
                    append({
                      exerciseId: null as string | null,
                      exerciseName: "",
                      sets: [
                        {
                          setId: null as string | null,
                          weight: 0,
                          reps: 0,
                          isBodyWeight: false,
                        },
                      ],
                    });
                  }}
                >
                  <Icons.Plus />
                  <span>Add Exercise</span>
                </button>
              </div>

              <div className="notes-section">
                <div className="section-header">
                  <h3>Notes</h3>
                  <span className="notes-hint">Optional</span>
                </div>
                <div className="textarea-wrapper">
                  <div className="textarea-icon">
                    <Icons.EditNote />
                  </div>
                  <textarea
                    {...register("note", { required: false })}
                    id="note"
                    placeholder="Add any notes about this workout session (e.g., focus on form, increase weight gradually, etc.)"
                    className="workout-session-notes"
                    rows={4}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Icons.Spinner />
                      <span>
                        {watch("workoutSessionId")
                          ? "Update Workout Session"
                          : "Save Workout Session"}
                      </span>
                    </>
                  ) : (
                    <span>
                      {watch("workoutSessionId")
                        ? "Update Workout Session"
                        : "Save Workout Session"}
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
});

export default WorkoutSessionForm;
