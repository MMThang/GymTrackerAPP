export function parseJwt(token: string) {
  const base64 = token.split(".")[1];
  return JSON.parse(atob(base64));
}

export function dayLookup(arrayData: any) {
  return arrayData.reduce(
    (
      acc: Record<
        number,
        {
          hasWorkoutSession: boolean;
          hasNote: boolean;
          workoutSessionId: string | null;
        }
      >,
      dayItem: {
        date: string;
        hasWorkoutSession: boolean;
        hasNote: boolean;
        workoutSessionId: string | null;
      },
    ) => {
      const dayNumber = new Date(dayItem.date).getUTCDate();
      acc[dayNumber] = dayItem;
      return acc;
    },
    {} as Record<
      number,
      {
        hasWorkoutSession: boolean;
        hasNote: boolean;
        workoutSessionId: string | null;
      }
    >,
  );
}
