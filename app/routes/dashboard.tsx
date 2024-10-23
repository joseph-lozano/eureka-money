import type { LoaderFunctionArgs } from "@vercel/remix";
import { Link, useLoaderData } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { useQuery } from "convex-helpers/react/cache";
import { ArrowRight, Car, CreditCard, DollarSign, House, Landmark, PiggyBank, PlusCircle, RefreshCwOff, Wallet } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { ensureAuthenticated } from "~/lib/auth.server";
import { cn } from "~/lib/utils";

function getAccountIcon(type: string) {
  switch (type) {
    case "Checking":
      return <DollarSign className="h-5 w-5 text-blue-500" />;
    case "Savings":
      return <PiggyBank className="h-5 w-5 text-green-500" />;
    case "Credit":
      return <CreditCard className="h-5 w-5 text-purple-500" />;
    case "Mortgage":
      return <House className="h-5 w-5 text-orange-500" />;
    case "Auto Loan":
      return <Car className="h-5 w-5 text-yellow-500" />;
    default:
      return <Wallet className="h-5 w-5 text-gray-500" />;
  }
}

export async function loader(args: LoaderFunctionArgs) {
  const { userId } = await ensureAuthenticated(args);
  return {
    userId,
    bankAccounts: [
      {
        name: "Chase",
        accounts: [
          { type: "Checking", name: "Chase Total Checking", balance: "$2,500.00", budget: true },
          { type: "Savings", name: "Chase Savings", balance: "$10,000.00", budget: true },
          { type: "Credit", name: "Chase Freedom Unlimited", balance: "$-1,200.00", budget: true },
          { type: "Credit", name: "Chase Sapphire Preferred", balance: "$-3,500.00", budget: true },
          { type: "Credit", name: "Chase Ink Business Preferred", balance: "$-2,800.00", budget: true },
          { type: "Credit", name: "Chase Amazon Prime Rewards", balance: "$-750.00", budget: true },
          { type: "Mortgage", name: "Chase Home Mortgage", balance: "$-350,000.00", budget: false },
          { type: "Auto Loan", name: "Chase Auto Loan", balance: "$-22,500.00", budget: false },
        ],
      },
      {
        name: "Bank of America",
        accounts: [
          { type: "Checking", name: "Bank of America Advantage Banking", balance: "$3,200.00", budget: true },
          { type: "Savings", name: "Bank of America Savings", balance: "$15,000.00", budget: true },
          { type: "Credit", name: "Bank of America Cash Rewards", balance: "$-800.00", budget: true },
          { type: "Credit", name: "Bank of America Travel Rewards", balance: "$-2,100.00", budget: true },
        ],
      },
      {
        name: "Wells Fargo",
        accounts: [
          { type: "Checking", name: "Wells Fargo Everyday Checking", balance: "$1,800.00", budget: true },
          { type: "Savings", name: "Wells Fargo Way2Save", balance: "$7,500.00", budget: true },
          { type: "Credit", name: "Wells Fargo Active Cash", balance: "$-1,500.00", budget: true },
        ],
      },
      {
        name: "Citibank",
        accounts: [
          { type: "Checking", name: "Citibank Basic Banking", balance: "$4,200.00", budget: true },
          { type: "Savings", name: "Citi Accelerate Savings", balance: "$20,000.00", budget: true },
          { type: "Credit", name: "Citi Double Cash Card", balance: "$-2,300.00", budget: true },
          { type: "Credit", name: "Citi Premier Card", balance: "$-4,100.00", budget: true },
        ],
      },
      {
        name: "Capital One",
        accounts: [
          { type: "Checking", name: "Capital One 360 Checking", balance: "$3,800.00", budget: true },
          { type: "Savings", name: "Capital One 360 Performance Savings", balance: "$12,500.00", budget: true },
          { type: "Credit", name: "Capital One Quicksilver", balance: "$-1,700.00", budget: true },
          { type: "Credit", name: "Capital One Venture", balance: "$-3,200.00", budget: true },
        ],
      },
      {
        name: "Discover",
        accounts: [
          { type: "Credit", name: "Discover it Cash Back", balance: "$-900.00", budget: true },
        ],
      },
    ],
  };
}

function Accounts() {
  const { bankAccounts } = useLoaderData<typeof loader>();
  const total = bankAccounts.reduce((acc, bank) => acc + bank.accounts.reduce((acc, account) =>
    account.budget ? acc + Number.parseFloat(account.balance.replace("$", "").replace(",", "")) : acc, 0), 0);
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-2xl">
          <div className="flex items-center space-x-2">
            <span>
              Accounts
            </span>
            <Badge variant={total > 0 ? "default" : "destructive"}>
              Total: $
              {Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total)}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {bankAccounts.map((bank, index) => (
          <div key={index} className="space-y-3 bg-secondary/50 p-4 rounded-lg">
            <p className="flex items-center text-lg font-semibold mb-3 pb-2 border-b">
              <Landmark className="mr-2 h-5 w-5" />
              {bank.name}
            </p>
            <div className="grid gap-2">
              {bank.accounts.map((account, accountIndex) => (
                <div key={accountIndex} className={cn("flex items-center justify-between rounded-lg p-3", account.budget ? "bg-background" : "bg-background/50")}>
                  <div className="flex items-center space-x-4">
                    {getAccountIcon(account.type)}
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{account.name}</p>
                      <div className="text-xs text-muted-foreground">
                        <Tooltip>
                          <TooltipTrigger>
                            <RefreshCwOff className="h-4 w-4 inline mr-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            This account is not automatically synced
                          </TooltipContent>
                        </Tooltip>
                        {account.type}
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <Badge variant={account.balance.startsWith("$-") ? "destructive" : "default"}>
                      {account.balance}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function Connections() {
  const { userId } = useLoaderData<typeof loader>();
  const data = useQuery(api.plaid.getPlaidItems, { clerkUserId: userId });
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Connections</CardTitle>
            <CardDescription>Automatically sync your bank accounts</CardDescription>
          </div>
          <Link className={buttonVariants({ variant: "outline" })} to="/connections/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Sync New Account
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {data?.map(item => (
            <div key={item._id}>
              <div className="flex items-center justify-between text-lg font-semibold mb-3 pb-2 border-b">
                <div className="flex items-center space-x-2">
                  <Landmark className="h-5 w-5" />
                  <span>
                    {item.institutionName}
                  </span>
                  <Badge variant="outline">
                    {item.accounts.length}
                    {" "}
                    accounts
                  </Badge>
                </div>
                <Link
                  to={`/connections/${item._id}`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="flex flex-col space-y-8">
        <Connections />
        <Accounts />
      </div>
    </div>
  );
}
