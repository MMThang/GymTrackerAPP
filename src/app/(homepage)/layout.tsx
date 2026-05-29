"use client";

import "./index.scss";

export default function HomepageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="homepage-container">
      <main className="main-content">{children}</main>
    </div>
  );
}
