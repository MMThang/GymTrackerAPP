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

// --- OTP resend cooldown helpers ---------------------------------------------
// The backend returns a `resendCooldownTimeStamp` (the moment the next resend
// is allowed) from sending-otp-email / resend-verification-code. We persist it
// in localStorage (per email) so the countdown survives page refreshes instead
// of restarting from the top every time.

const OTP_RESEND_COOLDOWN_PREFIX = "otp-resend-cooldown:";

function otpResendCooldownKey(email: string): string {
  return `${OTP_RESEND_COOLDOWN_PREFIX}${email}`;
}

// Normalizes an epoch-seconds number, epoch-milliseconds number or ISO-8601
// string into epoch milliseconds (null when unparseable).
function toEpochMs(
  timestamp: string | number | undefined | null,
): number | null {
  if (timestamp === undefined || timestamp === null) return null;

  if (typeof timestamp === "number") {
    // Values < 1e12 are epoch seconds, otherwise already epoch milliseconds.
    return timestamp < 1e12 ? timestamp * 1000 : timestamp;
  }

  const parsed = Date.parse(timestamp);
  return Number.isNaN(parsed) ? null : parsed;
}

export function storeOtpResendCooldown(
  email: string,
  timestamp: string | number | undefined | null,
) {
  if (typeof localStorage === "undefined" || !email) return;

  const epochMs = toEpochMs(timestamp);
  if (epochMs === null) return;

  localStorage.setItem(otpResendCooldownKey(email), String(epochMs));
}

export function clearOtpResendCooldown(email: string) {
  if (typeof localStorage === "undefined" || !email) return;
  localStorage.removeItem(otpResendCooldownKey(email));
}

// Returns the remaining seconds until a resend is allowed:
// - null when no cooldown was ever stored for this email
// - 0 when a stored cooldown already expired (resend allowed now)
// - otherwise the seconds still left.
export function getOtpResendCooldownSeconds(email: string): number | null {
  if (typeof localStorage === "undefined" || !email) return null;

  const raw = localStorage.getItem(otpResendCooldownKey(email));
  if (!raw) return null;

  const epochMs = Number(raw);
  if (Number.isNaN(epochMs)) {
    localStorage.removeItem(otpResendCooldownKey(email));
    return null;
  }

  const remainingMs = epochMs - Date.now();
  return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
}
