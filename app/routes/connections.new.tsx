import { useLoaderData, useSubmit } from "@remix-run/react";
import { type ActionFunctionArgs, json, type LoaderFunctionArgs, redirect } from "@vercel/remix";
import { api } from "convex/_generated/api";
import { CountryCode, Products } from "plaid";
import { useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { z } from "zod";
import { ensureAuthenticated } from "~/lib/auth.server";
import { convexClient } from "~/lib/convex.server";
import { plaidClient } from "~/lib/plaid.server";

const Schema = z.object({
  publicToken: z.string(),
  metadata: z.object({
    accounts: z.array(z.object({
      id: z.string(),
      mask: z.string(),
      name: z.string(),
      subtype: z.string(),
      type: z.string(),
    })),
    institution: z.object({
      institution_id: z.string(),
      name: z.string(),
    }),
  }),
}).transform(data => ({
  accounts: data.metadata.accounts.map(acc => ({ plaidId: acc.id, mask: acc.mask, name: acc.name, subtype: acc.subtype, type: acc.type })),
  publicToken: data.publicToken,
  institutionName: data.metadata.institution.name,
  institutionId: data.metadata.institution.institution_id,
}));

export async function action(args: ActionFunctionArgs) {
  const { userId } = await ensureAuthenticated(args);
  const parseResult = Schema.safeParse(await args.request.json());
  if (!parseResult.success) {
    return json({ error: "Invalid data" }, { status: 400 });
  }
  const { data } = await plaidClient.itemPublicTokenExchange({ public_token: parseResult.data.publicToken });
  await convexClient.mutation(api.plaid.createPlaidItem, {
    clerkUserId: userId,
    item: {
      accessToken: data.access_token,
      plaidId: data.item_id,
      requestId: data.request_id,
      institutionId: parseResult.data.institutionId,
      institutionName: parseResult.data.institutionName,
    },
    accounts: parseResult.data.accounts.map(acc => ({ ...acc })),

  });
  return redirect(`/connections/${data.item_id}`);
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
    onSuccess: (public_token, metadata) => {
      submit(JSON.stringify({ publicToken: public_token, metadata }), { method: "post", navigate: false, encType: "application/json" });
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
