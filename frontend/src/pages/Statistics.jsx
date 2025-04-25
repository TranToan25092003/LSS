import { useState, useEffect } from "react";
import { customFetch } from "@/utils/customAxios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const formatTime = (hours) => {
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) {
      return `${days} ngày`;
    }
    return `${days} ngày ${remainingHours} giờ`;
  }
  return `${hours} giờ`;
};

export default function Statistics() {
  const [stats, setStats] = useState({
    totalItems: 0,
    availableItems: 0,
    borrowedItems: 0,
    categories: [],
    topBorrowers: [],
    topItems: [],
    monthlyStats: [],
    categoryStats: [],
    returnRateStats: {
      onTime: 0,
      late: 0,
      notReturned: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch all items
        const itemsResponse = await customFetch.get("/items", {
          params: { limit: 1000 },
        });
        const items = itemsResponse.data.items || [];

        // Fetch all borrows
        let borrows = [];
        try {
          const borrowsResponse = await customFetch.get("/borrow/all");
          borrows = borrowsResponse.data.data || [];
        } catch (err) {
          console.error("Error fetching borrows:", err);
          toast.error("Không thể tải dữ liệu mượn đồ");
        }

        // Calculate basic stats
        const totalItems = items.length;
        const borrowedItems = items.filter(
          (item) => item.status === "notAvailable"
        ).length;
        const availableItems = items.filter(
          (item) => item.status === "available"
        ).length;

        // Calculate categories and their borrow rates
        const categoryStats = items.reduce((acc, item) => {
          const category = (item.category || "Chưa phân loại").trim();
          if (!acc[category]) {
            acc[category] = {
              total: 0,
              borrowed: 0,
              available: 0,
            };
          }
          acc[category].total++;
          if (item.status === "notAvailable") {
            acc[category].borrowed++;
          } else if (item.status === "available") {
            acc[category].available++;
          }
          return acc;
        }, {});

        // Calculate top borrowers with additional stats
        const borrowerStats = borrows.reduce((acc, borrow) => {
          if (!acc[borrow.borrowerClerkId]) {
            acc[borrow.borrowerClerkId] = {
              count: 0,
              totalTime: 0,
              returnRate: 0,
              returns: 0,
            };
          }
          acc[borrow.borrowerClerkId].count++;
          acc[borrow.borrowerClerkId].totalTime += borrow.totalTime || 0;
          if (borrow.returnStatus?.ownerConfirm) {
            acc[borrow.borrowerClerkId].returns++;
          }
          return acc;
        }, {});

        // Calculate return rate for each borrower
        Object.keys(borrowerStats).forEach((borrowerId) => {
          const stats = borrowerStats[borrowerId];
          stats.returnRate =
            stats.count > 0 ? (stats.returns / stats.count) * 100 : 0;
        });

        const topBorrowers = await Promise.all(
          Object.entries(borrowerStats)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 5)
            .map(async ([clerkId, stats]) => {
              try {
                const userResponse = await customFetch.get(`/users/${clerkId}`);
                const user = userResponse.data;
                return {
                  name: user
                    ? `${user.firstName} ${user.lastName}`
                    : "Người dùng không xác định",
                  ...stats,
                };
              } catch (err) {
                console.error(`Error fetching user ${clerkId}:`, err);
                return {
                  name: "Người dùng không xác định",
                  ...stats,
                };
              }
            })
        );

        // Calculate top borrowed items with additional stats
        const itemStats = borrows.reduce((acc, borrow) => {
          const itemId = borrow.item?._id || borrow.item;
          if (!acc[itemId]) {
            acc[itemId] = {
              count: 0,
              totalTime: 0,
              returnRate: 0,
              returns: 0,
            };
          }
          acc[itemId].count++;
          acc[itemId].totalTime += borrow.totalTime || 0;
          if (borrow.returnStatus?.ownerConfirm) {
            acc[itemId].returns++;
          }
          return acc;
        }, {});

        // Calculate return rate for each item
        Object.keys(itemStats).forEach((itemId) => {
          const stats = itemStats[itemId];
          stats.returnRate =
            stats.count > 0 ? (stats.returns / stats.count) * 100 : 0;
        });

        const topItems = await Promise.all(
          Object.entries(itemStats)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 5)
            .map(async ([itemId, stats]) => {
              try {
                const itemResponse = await customFetch.get(`/items/${itemId}`);
                const item = itemResponse.data;
                return {
                  name: item ? item.name : "Đồ vật không xác định",
                  category: item ? item.category : "Danh mục không xác định",
                  ...stats,
                };
              } catch (err) {
                console.error(`Error fetching item ${itemId}:`, err);
                return {
                  name: "Đồ vật không xác định",
                  category: "Danh mục không xác định",
                  ...stats,
                };
              }
            })
        );

        // Calculate monthly statistics with return rates
        const monthlyStats = borrows.reduce((acc, borrow) => {
          const month = format(new Date(borrow.createdAt), "yyyy-MM", {
            locale: vi,
          });
          if (!acc[month]) {
            acc[month] = {
              totalBorrows: 0,
              totalReturns: 0,
              onTimeReturns: 0,
              lateReturns: 0,
            };
          }
          acc[month].totalBorrows++;
          if (borrow.returnStatus?.ownerConfirm) {
            acc[month].totalReturns++;
            // Check if return was on time
            const returnDate = new Date(borrow.returnStatus.timeReturned);
            const dueDate = new Date(borrow.createdAt);
            dueDate.setHours(dueDate.getHours() + borrow.totalTime);

            if (returnDate <= dueDate) {
              acc[month].onTimeReturns++;
            } else {
              acc[month].lateReturns++;
            }
          }
          return acc;
        }, {});

        setStats({
          totalItems,
          availableItems,
          borrowedItems,
          categories: Object.entries(categoryStats).map(
            ([category, stats]) => ({
              category,
              ...stats,
              utilizationRate:
                stats.total > 0
                  ? ((stats.borrowed / stats.total) * 100).toFixed(1)
                  : "0.0",
            })
          ),
          topBorrowers,
          topItems,
          monthlyStats: Object.entries(monthlyStats)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([month, data]) => ({
              month,
              ...data,
              returnRate:
                data.totalBorrows > 0
                  ? ((data.totalReturns / data.totalBorrows) * 100).toFixed(1)
                  : "0.0",
              onTimeRate:
                data.totalReturns > 0
                  ? ((data.onTimeReturns / data.totalReturns) * 100).toFixed(1)
                  : "0.0",
            })),
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        toast.error("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[100px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Thống kê hệ thống</h1>
      {/* Basic Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tổng số đồ</CardTitle>
            <CardDescription>Tổng số đồ trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đồ có sẵn</CardTitle>
            <CardDescription>Số đồ đang có sẵn để mượn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đồ đang mượn</CardTitle>
            <CardDescription>Số đồ đang được mượn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.borrowedItems}</div>
          </CardContent>
        </Card>
      </div>
      {/* Category Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê theo danh mục</CardTitle>
          <CardDescription>Tình trạng mượn theo từng danh mục</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Danh mục</TableHead>
                <TableHead>Tổng số</TableHead>
                <TableHead>Đang mượn</TableHead>
                <TableHead>Có sẵn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.categories.map((cat) => (
                <TableRow key={cat.category}>
                  <TableCell>{cat.category}</TableCell>
                  <TableCell>{cat.total}</TableCell>
                  <TableCell>{cat.borrowed}</TableCell>
                  <TableCell>{cat.available}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Top Borrowers */}
      <Card>
        <CardHeader>
          <CardTitle>Top người mượn nhiều nhất</CardTitle>
          <CardDescription>5 người dùng mượn đồ nhiều nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Số lần mượn</TableHead>
                <TableHead>Tổng thời gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.topBorrowers.map((borrower, index) => (
                <TableRow key={index}>
                  <TableCell>{borrower.name}</TableCell>
                  <TableCell>{borrower.count}</TableCell>
                  <TableCell>{formatTime(borrower.totalTime)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Top Items */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Top đồ được mượn nhiều nhất</CardTitle>
          <CardDescription>5 đồ được mượn nhiều nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên đồ</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Số lần mượn</TableHead>
                <TableHead>Tổng thời gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.topItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.count}</TableCell>
                  <TableCell>{formatTime(item.totalTime)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card> */}
      {/* Monthly Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê theo tháng</CardTitle>
          <CardDescription>Số lượng mượn và trả theo tháng</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tháng</TableHead>
                <TableHead>Số lần mượn</TableHead>
                <TableHead>Số lần trả</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.monthlyStats.map((stat) => (
                <TableRow key={stat.month}>
                  <TableCell>{stat.month}</TableCell>
                  <TableCell>{stat.totalBorrows}</TableCell>
                  <TableCell>{stat.totalReturns}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
