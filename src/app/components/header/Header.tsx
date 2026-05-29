"use client";

import { redirect, usePathname, useRouter } from "next/navigation";
import { use, useState } from "react";
import "./header.scss";
import { useUser } from "@/app/context-provider";
import { logout } from "@/app/actions/user-actions";
import { Button } from "../buttons/button";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { userPromise } = useUser();
  const user = use(userPromise);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isNotCalendarPage = pathname.endsWith("/workout-session");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const today = new Date();
  const formattedDate = formatDate(today);

  const goToCalendar = () => {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    router.push(`/calendar/${year}/${month}`);
  };

  const handleLogout = async () => {
    await logout();
    redirect("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        {isNotCalendarPage && (
          <button className="back-btn" onClick={goToCalendar}>
            ←
          </button>
        )}
        <div className="date-display">{formattedDate}</div>
      </div>

      <div className="header-right">
        <div className="user-menu">
          <button
            className="avatar-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onMouseEnter={() => setIsDropdownOpen(true)}
          >
            <div className="avatar">
              {user?.email ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </button>

          {isDropdownOpen && (
            <div
              className="dropdown-menu"
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <Button
                href="/"
                p="Profile"
                btnType="button"
                type="redirect"
                className="dropdown-item profile-item"
              />
              <div className="dropdown-divider"></div>
              <Button
                href="templates"
                p="Logout"
                btnType="button"
                type="button"
                onClick={handleLogout}
                className="dropdown-item profile-item"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
