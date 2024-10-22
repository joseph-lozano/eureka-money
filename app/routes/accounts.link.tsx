import { useLoaderData, useSubmit } from "@remix-run/react";
import { type ActionFunctionArgs, json, type LoaderFunctionArgs, redirect } from "@vercel/remix";
import { api } from "convex/_generated/api";
import { CountryCode, Products } from "plaid";
import { useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { ensureAuthenticated } from "~/lib/auth.server";
import { convexClient } from "~/lib/convex.server";
import { plaidClient } from "~/lib/plaid.server";

export async function action(args: ActionFunctionArgs) {
  const { userId } = await ensureAuthenticated(args);
  const formData = await args.request.formData();
  const public_token = formData.get("publicToken");
  if (typeof public_token !== "string") {
    return json({ error: "Invalid public token" }, { status: 400 });
  }
  const { data } = await plaidClient.itemPublicTokenExchange({ public_token });
  await convexClient.mutation(api.plaid.createPlaidItem, {
    externalUserId: userId,
    accessToken: data.access_token,
    itemId: data.item_id,
    requestId: data.request_id,
  });
  return redirect("/dashboard");
}

export async function loader(args: LoaderFunctionArgs) {
  const { userId } = await ensureAuthenticated(args);
  const { data: { link_token } } = await plaidClient.linkTokenCreate({
    user: {
      client_user_id: userId,
    },
    client_name: "Eureka Money",
    products: [Products.Transactions],
    language: "en",
    country_codes: [CountryCode.Us],
  });
  return json({ linkToken: link_token });
}

export default function LinkAccounts() {
  const { linkToken } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token) => {
      submit({ publicToken: public_token }, { method: "post", navigate: false });
    },
  });
  useEffect(() => {
    if (ready) {
      // eslint-disable-next-line ts/no-unsafe-call
      open();
    }
  }, [open, ready]);
  return <div>{linkToken}</div>;
}
