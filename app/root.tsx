import type { LoaderFunction } from "@vercel/remix";

import { ClerkApp, SignedIn, SignedOut, UserButton } from "@clerk/remix";
import { rootAuthLoader } from "@clerk/remix/ssr.server";

import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";

export const loader: LoaderFunction = async args => rootAuthLoader(args);

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-base-200">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="navbar bg-primary text-primary-content">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost normal-case text-xl">Eureka Money</Link>
        </div>
        <div className="navbar-end">
          <SignedOut>

            <Link to="/sign-in" className="btn">
              Sign In
            </Link>
          </SignedOut>

          <SignedIn>
            <div className="space-x-2 flex">
              <Link to="/dashboard" className="btn">Dashboard</Link>
              <div className="size-12">

                <UserButton />
              </div>
            </div>
          </SignedIn>
        </div>
      </div>
      <div className="grow py-12 container mx-auto">
        <Outlet />
      </div>
    </div>
  );
}

const MyApp = ClerkApp(App, {
  signInFallbackRedirectUrl: "/dashboard",
  appearance: {
    variables: {
      colorPrimary: "#059669",
    },
    elements: {
      userButtonAvatarBox: "size-12",
    },
  },
});

export default MyApp;
