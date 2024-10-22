import type { MetaFunction } from "@vercel/remix";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col items-center space-y-12">
      <h1 className="text-6xl font-black text-center">
        Manage your family&apos;s finances and
        {" "}
        <span className="text-primary">discover financial freedom</span>
      </h1>
      <p className="badge uppercase badge-xl font-bold badge-accent text-xl py-3">Coming soon</p>
    </div>
  );
}
