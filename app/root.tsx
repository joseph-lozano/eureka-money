import type { LoaderFunctionArgs } from "@vercel/remix";

import { ClerkApp, SignedIn, SignedOut, UserButton } from "@clerk/remix";
import { rootAuthLoader } from "@clerk/remix/ssr.server";

import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache";
import { useState } from "react";
import { buttonVariants } from "./components/ui/button";
import { TooltipProvider } from "./components/ui/tooltip";
import { env } from "./lib/env.server";
import { cn } from "./lib/utils";
import "./tailwind.css";

export async function loader(args: LoaderFunctionArgs) {
  return rootAuthLoader(args, () => {
    return {
      convexUrl: env.CONVEX_URL,
    };
  });
}

export function ErrorBoundary() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-primary text-primary-foreground flex justify-between items-center px-4 h-16">
        <div>
          <Link to="/" className={cn(buttonVariants({ variant: "ghost" }), "text-xl font-black")}>Eureka Money</Link>
        </div>
        <div>
          <Link to="/dashboard" className={cn(buttonVariants({ variant: "secondary" }), "text-lg font-bold")}>Dashboard</Link>
        </div>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! An error occurred</h1>
          <p className="text-gray-700 mb-6">We're sorry, but something went wrong. Please try again later.</p>
          <Link
            to="/dashboard"
            className={cn(
              buttonVariants({ variant: "default" }),
              "w-full text-center",
            )}
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

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
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  const { convexUrl } = useLoaderData<typeof loader>();
  const [convex] = useState(() => new ConvexReactClient(convexUrl));
  return (
    <ConvexProvider client={convex}>
      <ConvexQueryCacheProvider>
        <div className="min-h-screen flex flex-col">
          <div className="bg-primary text-primary-foreground flex justify-between items-center px-4 h-16">
            <div>
              <Link to="/" className={cn(buttonVariants({ variant: "ghost" }), "text-xl font-black")}>Eureka Money</Link>
            </div>
            <div>
              <SignedOut>

                <Link to="/sign-in" className="btn">
                  Sign In
                </Link>
              </SignedOut>

              <SignedIn>
                <div className="space-x-2 flex items-center">
                  <Link to="/dashboard" className={cn(buttonVariants({ variant: "secondary" }), "text-lg font-bold")}>Dashboard</Link>
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
      </ConvexQueryCacheProvider>
    </ConvexProvider>
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
