import type { LoaderFunctionArgs } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { redirect } from "@vercel/remix";

export async function loader(args: LoaderFunctionArgs) {
  const { userId } = await getAuth(args);
  if (userId == null) {
    return redirect("/sign-in");
  }
  return null;
}
