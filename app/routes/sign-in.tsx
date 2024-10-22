import { SignIn as ClerkSignIn } from "@clerk/remix";
import { useSearchParams } from "@remix-run/react";

export default function SignIn() {
  const search = useSearchParams();
  const [searchParams] = search;
  const redirectUrl = searchParams.get("redirectUrl");
  return (
    <div className="flex justify-center">
      <p>{redirectUrl}</p>
      <ClerkSignIn forceRedirectUrl={redirectUrl ?? "/dashboard"} />
    </div>
  );
}
