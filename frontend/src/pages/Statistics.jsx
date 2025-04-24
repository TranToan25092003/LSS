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
import { toast, Toaster } from "react-hot-toast";

export default function Statistics() {
  const [stats, setStats] = useState({
    totalItems: 0,
    availableItems: 0,
    borrowedItems: 0,
    categories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch all items
        const response = await customFetch.get("/items", {
          params: { limit: 1000 },
        });

        const items = response.data.items || [];
        console.log("Items:", items);

        // Calculate basic stats
        const totalItems = items.length;
        const borrowedItems = items.filter(
          (item) => item.status === "borrowed"
        ).length;
        const availableItems = items.filter(
          (item) => item.status === "available"
        ).length;

        // Calculate categories
        const categories = items.reduce((acc, item) => {
          const category = (item.category || "Chưa phân loại").trim();
          if (category) {
            acc[category] = (acc[category] || 0) + 1;
          } else {
            acc["Chưa phân loại"] = (acc["Chưa phân loại"] || 0) + 1;
          }
          return acc;
        }, {});

        setStats({
          totalItems,
          availableItems,
          borrowedItems,
          categories: Object.entries(categories),
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[120px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold tracking-tight">Thống kê sản phẩm</h2>

      {/* Basic Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tổng số sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalItems}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm khả dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {stats.availableItems}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Phân loại sản phẩm</CardTitle>
          <CardDescription>
            Số lượng sản phẩm theo từng danh mục
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.categories.map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="font-medium">{category}</span>
                <span className="text-gray-600">{count} sản phẩm</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
