import { SignIn as ClerkSignIn } from "@clerk/remix";

export function loader() {
  return null;
}

export default function SignIn() {
  return (
    <div className="flex justify-center">
      <ClerkSignIn />
    </div>
  );
}
