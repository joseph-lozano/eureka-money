import { getAuth } from "@clerk/remix/ssr.server";
import { type LoaderFunctionArgs, redirect } from "@vercel/remix";

export async function ensureAuthenticated(args: LoaderFunctionArgs) {
  const auth = await getAuth(args);
  if (auth.userId == null) {
    const redirectUrl = encodeURIComponent(args.request.url);
    throw redirect(`/sign-in?redirectUrl=${redirectUrl}`);
  }
  return auth;
}
