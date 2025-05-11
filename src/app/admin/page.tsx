import { notFound } from "next/navigation";
import { db } from "@/db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusDropdown from "./StatusDropdown";
import { OrderTable } from "./OrderTable";
import { createClient } from "@/utils/supabase/server";

const Page = async () => {
  // Fetch the user using your server-side Supabase client.
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const user = data.user;

  console.log("user is", user);

  // Make sure the admin email is set as an environment variable with the NEXT_PUBLIC_ prefix.
  // For admin checks on the server, use a case-insensitive comparison:
  const isAdmin =
    user?.email?.toLowerCase() ===
    process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();

  // If no user is logged in or the user is not the admin, show a 404 page.
  if (!user || !isAdmin) {
    return notFound();
  }

  // Fetch orders from the last 7 days.
  const orders = await db.order.findMany({
    where: {
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    orderBy: { createdAt: "desc" },
    include: { 
      user: true, 
      shippingAddress: true,
      configuration: {
        include: {
          color: true, 
          size: true, 
          fabric: true,
          product: true,
        }
      }
     },
  });

  // Aggregate revenue data.
  const lastWeekSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    _sum: { amount: true },
  });

  const lastMonthSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
    _sum: { amount: true },
  });

  const WEEKLY_GOAL = 5000;
  const MONTHLY_GOAL = 25000;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-100 p-4">
        <nav className="flex flex-col gap-4">
          <Link href="/admin">
            <div className="px-4 py-2 bg-indigo-700 text-white rounded">
              Dashboard
            </div>
          </Link>
          <Link href="/admin/new-product">
            <div className="px-4 py-2 bg-green-600 text-white rounded">
              Add New Product
            </div>
          </Link>
          <Link href="/admin/new-category">
            <div className="px-4 py-2 bg-yellow-600 text-white rounded">
              Add New Category
            </div>
          </Link>
          <Link href="/admin/new-color">
            <div className="px-4 py-2 bg-yellow-600 text-white rounded">
              Add New Color
            </div>
          </Link>
          <Link href="/admin/new-fabric">
            <div className="px-4 py-2 bg-yellow-600 text-white rounded">
              Add New Fabric
            </div>
          </Link>
          <Link href="/admin/new-size">
            <div className="px-4 py-2 bg-yellow-600 text-white rounded">
              Add New Size
            </div>
          </Link>
          {/* Additional admin links */}
        </nav>
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-1 p-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last Week</CardDescription>
                <CardTitle className="text-4xl">
                  {formatPrice(lastWeekSum._sum.amount ?? 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  of {formatPrice(WEEKLY_GOAL)} goal
                </div>
              </CardContent>
              <CardFooter>
                <Progress
                  value={((lastWeekSum._sum.amount ?? 0) * 100) / WEEKLY_GOAL}
                />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last Month</CardDescription>
                <CardTitle className="text-4xl">
                  {formatPrice(lastMonthSum._sum.amount ?? 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  of {formatPrice(MONTHLY_GOAL)} goal
                </div>
              </CardContent>
              <CardFooter>
                <Progress
                  value={((lastMonthSum._sum.amount ?? 0) * 100) / MONTHLY_GOAL}
                />
              </CardFooter>
            </Card>
          </div>

          <h1 className="text-4xl font-bold tracking-tight">Incoming Orders</h1>
          {/* <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Purchase Date
                </TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="bg-accent">
                  <TableCell>
                    <div className="font-medium">
                      {order.shippingAddress?.name}
                    </div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {order.user.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <StatusDropdown id={order.id} orderStatus={order.status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {order.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(order.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table> */}
          <OrderTable orders={orders} />
        </div>
      </main>
    </div>
  );
};

export default Page;
