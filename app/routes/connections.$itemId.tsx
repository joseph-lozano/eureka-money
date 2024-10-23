import type { LoaderFunctionArgs } from "@vercel/remix";
import { json, useParams } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { ensureAuthenticated } from "~/lib/auth.server";
import { convexClient } from "~/lib/convex.server";

export async function loader(args: LoaderFunctionArgs) {
  const { userId } = await ensureAuthenticated(args);
  const itemId = args.params.itemId;
  const item = await convexClient.query(api.plaid.getPlaidItem, { clerkUserId: userId, itemId: itemId! });
  if (!item) {
    throw new Response(null, {
      status: 404,
    });
  }
  return json({ item });
}

export default function Connection() {
  const { itemId } = useParams();
  return (
    <div>
      Connection
      {" "}
      {itemId}
    </div>
  );
}
