import type { Metadata } from "next";
import "./main.scss";
import { getSession } from "./actions/user-actions";
import { UserContextProvider } from "./context-provider";

export const metadata: Metadata = {
  title: "Gym Tracker",
  description: "Gym tracker app to track your workouts and progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = getSession();
  return (
    <html lang="en">
      <body>
        <UserContextProvider userPromise={session}>
          {children}
        </UserContextProvider>
      </body>
    </html>
  );
}
