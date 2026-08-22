"use client";

import { Header } from "@/app/components/header/Header";
// import "./[year]/[month]/index.scss";

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="calendar">
      <Header />
      {children}
    </div>
  );
}
