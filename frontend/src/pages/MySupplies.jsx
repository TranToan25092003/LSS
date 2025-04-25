"use client"

import clerk from "@/utils/clerk"
import { useState } from "react"
import { redirect, useLoaderData, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { customFetch } from "@/utils/customAxios"
import Swal from "sweetalert2"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

export const mySuppliesLoader = async () => {
  try {
    if (!clerk.isSignedIn) {
      toast("Bạn phải đăng nhập trước", {
        description: "Vui lòng đăng nhập",
      })
      return redirect("/")
    }

    const { data } = await customFetch.get("/lends/supplies")

    return {
      data: data.data,
    }
  } catch {
    toast("Lỗi khi tải dữ liệu")
  }
}
const changeLendStatus = async (itemId, currentStatus, navigate) => {
  const newStatus = currentStatus === "available" ? "notAvailable" : "available";
  const actionText = currentStatus === "available" ? "Dừng cho mượn" : "Cho mượn";

  const result = await Swal.fire({
    title: "Xác nhận",
    text: `Bạn muốn ${actionText} vật phẩm này?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: actionText,
    cancelButtonText: "Hủy",
  });

  if (result.isConfirmed) {
    try {
      await customFetch.put(`/items/update/${itemId}`, { status: newStatus });
      toast("Thành công", { description: `Vật phẩm đã được ${actionText}` });
      if (typeof navigate === "function") {
        navigate(0); // Reload the page
      } else {
        console.warn("navigate is not a function, page will not reload automatically.");
        // Fallback: Manually reload the page using window.location
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast("Lỗi", { description: "Không thể cập nhật trạng thái vật phẩm" });
    }
  }
};

const MySupplies = () => {
  const { data } = useLoaderData()
  const navigate = useNavigate()

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  const handleEdit = async (itemId) => {
    try {
      const { data: itemData } = await customFetch.get(`/items/${itemId}`)
      setCurrentItem(itemData)
      setEditModalOpen(true)
    } catch (error) {
      console.error("Lỗi khi lấy thông tin vật phẩm:", error)
      toast("Lỗi", { description: "Không thể lấy thông tin vật phẩm" })
    }
  }

  const handleDelete = async (itemId) => {
    try {
      const result = await Swal.fire({
        title: "Xác nhận",
        text: "Bạn có chắc chắn muốn xóa vật phẩm này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      })

      if (result.isConfirmed) {
        await customFetch.delete(`/items/delete/${itemId}`)
        toast("Thành công", { description: "Vật phẩm đã được xóa" })
        navigate(0) // Reload the page to reflect changes
      }
    } catch (error) {
      console.error("Lỗi khi xóa vật phẩm:", error)
      toast("Lỗi", { description: "Không thể xóa vật phẩm" })
    }
  }

  const formSchema = z.object({
    name: z.string().min(1, { message: "Tên không được để trống" }),
    category: z.string().min(1, { message: "Danh mục không được để trống" }),
    description: z.string(),
    price: z.coerce.number().min(0, { message: "Giá không được âm" }),
    isFree: z.boolean().default(false),
    rate: z.string(),
    status: z.enum(["available", "unavailable"]),
    images: z.string(),
  })

  const EditItemModal = ({ item, isOpen, onClose }) => {
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: item?.name || "",
        category: item?.category || "",
        description: item?.description || "",
        price: item?.price || 0,
        isFree: item?.isFree || false,
        rate: item?.rate || "",
        status: item?.status || "available",
        images: item?.images?.join(", ") || "",
      },
    })

    const onSubmit = async (values) => {
      try {
        const updatedData = {
          ...values,
          images: values.images
            .split(",")
            .map((url) => url.trim())
            .filter(Boolean),
        }

        await customFetch.put(`/items/update/${item._id}`, updatedData)
        toast("Thành công", { description: "Vật phẩm đã được cập nhật" })
        onClose()
        navigate(0)
      } catch (error) {
        console.error("Lỗi khi cập nhật vật phẩm:", error)
        toast("Lỗi", { description: "Không thể cập nhật vật phẩm" })
      }
    }

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Chỉnh sửa vật phẩm</DialogTitle>
            <DialogDescription>Cập nhật thông tin vật phẩm của bạn. Nhấn lưu khi hoàn tất.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên vật phẩm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <FormControl>
                      <Input placeholder="Danh mục" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Mô tả chi tiết về vật phẩm" className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Giá" {...field} disabled={form.watch("isFree")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate</FormLabel>
                      <FormControl>
                        <Input placeholder="Rate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Miễn phí</FormLabel>
                      <FormDescription>Đánh dấu nếu vật phẩm này được cho mượn miễn phí</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Có sẵn</SelectItem>
                        <SelectItem value="unavailable">Không có sẵn</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hình ảnh</FormLabel>
                    <FormControl>
                      <Input placeholder="URL hình ảnh, cách nhau bởi dấu phẩy" {...field} />
                    </FormControl>
                    <FormDescription>Nhập các URL hình ảnh, cách nhau bởi dấu phẩy</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Hủy
                </Button>
                <Button type="submit">Lưu thay đổi</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Danh sách vật phẩm</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(({ item }) => (
          <Card key={item._id} className="flex flex-col">
            <CardHeader>
              <img
                src={
                  item.images && item.images[0] ? item.images[0] : "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="flex-1">
              <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="mt-2 text-sm text-gray-600 truncate">{item.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-medium">
                  {item.isFree ? "Miễn phí" : `${item.price.toLocaleString()} VNĐ / ${item.rate}`}
                </span>
                <Badge variant={item.status === "available" ? "default" : "destructive"}>
                  {item.status === "available" ? "Có sẵn" : "Không có sẵn"}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
            <Button
  className="flex-1 hover:bg-green-400 cursor-pointer"
  variant={`${item.status === "available" ? "destructive" : "outline"}`}
  onClick={() => changeLendStatus(item._id, item.status)}
>
  {item.status === "available" ? "Dừng cho mượn" : "Cho mượn"}
</Button>
              <Button
                className="flex-1 hover:bg-blue-400 cursor-pointer"
                variant="outline"
                onClick={() => handleEdit(item._id)}
              >
                Chỉnh sửa
              </Button>
              <Button
                className="flex-1 hover:bg-red-400 cursor-pointer"
                variant="destructive"
                onClick={() => handleDelete(item._id)}
              >
                Xóa
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {currentItem && (
        <EditItemModal item={currentItem} isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} />
      )}
    </div>
  )
}

export default MySupplies