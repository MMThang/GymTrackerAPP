import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OAuthCallback from "./OAuthCallback";

type SearchParams = Promise<{ code: string | undefined }>;

export default async function Calendar({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const cookieStore = await cookies();
  const authDataCookie = cookieStore.get("session");
  const resolvedSearchParams = await searchParams;
  const code = resolvedSearchParams.code;

  // Exchange the code via a client-initiated Server Action so Next.js allows
  // cookie mutation inside oauthCodeExchange. The action itself now also
  // guards against its own non-200 responses.
  if (authDataCookie) {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    redirect(`/calendar/${year}/${month}`);
  } else if (code!) {
    return <OAuthCallback code={code!} />;
  } else {
    redirect("/login");
  }
}
