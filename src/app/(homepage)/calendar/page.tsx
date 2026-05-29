import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Calendar() {
  const cookieStore = await cookies();
  const authDataCookie = cookieStore.get("session");
  if (!authDataCookie) {
    redirect("/login");
  }

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  redirect(`/calendar/${year}/${month}`);
}
