import type { Metadata } from "next";
import "./main.scss";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
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
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="dark"
          />
        </UserContextProvider>
      </body>
    </html>
  );
}
