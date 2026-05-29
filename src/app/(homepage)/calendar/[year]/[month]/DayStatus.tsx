import { Icons } from "@/app/components/icons";

interface DayStatusProps {
  day: number;
  dayDict: Record<
    number,
    {
      hasWorkoutSession: boolean;
      hasNote: boolean;
      workoutSessionId: string | null;
    }
  >;
}

export async function DayStatus({ day, dayDict }: DayStatusProps) {
  if (!dayDict[day]) {
    return null;
  }

  return (
    <>
      {dayDict[day].hasWorkoutSession ? (
        <Icons.CheckCircle />
      ) : (
        <Icons.Exclaimation_Mark />
      )}

      {dayDict[day].hasNote && <Icons.Note />}
    </>
  );
}
