import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="container py-12 mx-auto flex flex-col items-center space-y-12">
      <h1 className="text-6xl font-black text-center">
        Manage your family&apos;s finances and
        {" "}
        <span className="text-primary">discover financial freedom</span>
      </h1>
      <p className="badge uppercase badge-xl font-bold badge-accent text-xl py-3">Coming soon</p>
    </div>
  );
}
