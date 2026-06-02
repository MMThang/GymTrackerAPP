import { getSession } from "@/app/actions/user-actions";
import { getWorkoutCalendar } from "@/app/actions/workout-session-action";
import { Icons } from "@/app/components/icons";
import { dayLookup } from "@/app/utils/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DayStatus } from "./DayStatus";

interface CalendarProps {
  year: number;
  month: number; // 1-12
}

export default async function Month({
  params,
}: {
  params: Promise<CalendarProps>;
}) {
  const user = await getSession();

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const param = await params;

  // Fetch calendar data and handle "Cannot request month" error
  const calendarResponse = await getWorkoutCalendar({
    userId: user.sid,
    month: param.month,
    year: param.year,
  });

  if (
    !calendarResponse.success &&
    /cannot\s+request\s+month/i.test(calendarResponse.debugInfo?.serverData)
  ) {
    const today = new Date();
    redirect(`/calendar/${today.getFullYear()}/${today.getMonth() + 1}`);
  }

  const calendarDayDict = calendarResponse.success
    ? dayLookup(calendarResponse.data)
    : {};

  const firstDay = new Date(Date.UTC(param.year, param.month - 1, 1));
  const lastDay = new Date(Date.UTC(param.year, param.month, 0));

  const firstWeekday = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = lastDay.getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const grid: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...daysArray,
  ];

  // Navigation helpers
  const year = Number(param.year);
  const month = Number(param.month);

  const prevMonth =
    month === 1
      ? { year: year - 1, month: 12 }
      : { year: year, month: month - 1 };

  const nextMonth =
    month === 12
      ? { year: year + 1, month: 1 }
      : { year: year, month: month + 1 };

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // 1-12
  const isCurrentMonth =
    currentYear === param.year && currentMonth === param.month;

  // Check if next month is in the future
  const isNextMonthFuture =
    nextMonth.year > currentYear ||
    (nextMonth.year === currentYear && nextMonth.month > currentMonth);

  return (
    <div className="calendar-page">
      {/* Animated background */}
      <div className="auth-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      <div className="calendar-container">
        <div className="calendar-card">
          {/* Navigation */}
          <div className="calendar-nav">
            <Link
              href={`/calendar/${prevMonth.year}/${prevMonth.month}`}
              className="nav-btn"
            >
              <Icons.ChevronLeft />
            </Link>
            <span className="nav-month">{isCurrentMonth && "This Month"}</span>
            {isNextMonthFuture ? (
              <span className="nav-btn disabled">
                <Icons.ChevronRight />
              </span>
            ) : (
              <Link
                href={`/calendar/${nextMonth.year}/${nextMonth.month}`}
                className="nav-btn"
              >
                <Icons.ChevronRight />
              </Link>
            )}
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {/* Days of week header */}
            <div className="calendar-weekdays">
              {daysOfWeek.map((day) => (
                <div key={day} className="weekday">
                  {day}
                </div>
              ))}
            </div>

            {/* Date cells */}
            <div className="calendar-dates">
              {grid.map((day, idx) => {
                const isToday = isCurrentMonth && day === today.getDate();
                // Check if this date is in the future
                let isFutureDate = false;
                if (day !== null) {
                  const currentDate = new Date();
                  const cellDate = new Date(
                    Date.UTC(param.year, param.month - 1, day - 1),
                  );
                  // Reset time part for proper date comparison
                  currentDate.setHours(0, 0, 0, 0);
                  isFutureDate = cellDate > currentDate;
                }

                // Empty cells: render as plain div
                if (!day) {
                  return <div key={idx} className="date-cell empty" />;
                }

                // Future dates: render as non-interactive cell
                if (isFutureDate) {
                  return (
                    <div key={idx} className="date-cell future-date">
                      <span className="date-number">{day}</span>

                      <div className="day-indicators">
                        <Suspense fallback={<div className="skeleton-icon" />}>
                          <DayStatus day={day} dayDict={calendarDayDict} />
                        </Suspense>
                      </div>
                    </div>
                  );
                }

                // Active date: whole cell is a clickable link
                return (
                  <Link
                    key={idx}
                    href={`${month}/${day}/workout-session`}
                    className={`date-cell date-link ${isToday ? "today" : ""}`}
                  >
                    <span className="date-number">{day}</span>

                    <div className="day-indicators">
                      <Suspense fallback={<div className="skeleton-icon" />}>
                        <DayStatus day={day} dayDict={calendarDayDict} />
                      </Suspense>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
