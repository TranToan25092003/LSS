import clerk from "@/utils/clerk";
import React from "react";
import { redirect, useLoaderData } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { customFetch } from "@/utils/customAxios";
import Swal from "sweetalert2";

export const mySuppliesLoader = async () => {
  try {
    if (!clerk.isSignedIn) {
      toast("You must login first", {
        description: "Login please",
      });
      return redirect("/");
    }

    const { data } = await customFetch.get("/lends/supplies");

    return {
      data: data.data,
    };
  } catch (error) {
    toast("error");
  }
};

const changeLendStatus = async (lendId) => {
  const result = await Swal.fire({
    title: "Xác nhận",
    text: "Bạn muốn cho mượn hay huỷ yêu cầu này?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Cho mượn",
    cancelButtonText: "Huỷ",
  });

  if (result.isConfirmed) {
    console.log(lendId);
    const response = await customFetch.put(`/lends/supplies/${lendId}`, {
      status: "available",
    });

    console.log(response);

    await Swal.fire({
      title: "Thành công!",
      text: "Yêu cầu đã bị huỷ.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    await Swal.fire({
      title: "Thành công!",
      text: "Yêu cầu đã bị huỷ.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  }
};

const MySupplies = () => {
  const { data } = useLoaderData();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">my supplies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(({ item }) => (
          <Card key={item._id} className="flex flex-col">
            <CardHeader>
              <img
                src={
                  item.images[0] ||
                  "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="flex-1">
              <CardTitle className="text-lg font-semibold">
                {item.name}
              </CardTitle>
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="mt-2 text-sm text-gray-600 truncate">
                {item.description}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-medium">
                  {item.isFree
                    ? "Miễn phí"
                    : `${item.price.toLocaleString()} VNĐ / ${item.rate}`}
                </span>
                <Badge
                  variant={
                    item.status === "available" ? "default" : "destructive"
                  }
                >
                  {item.status === "available" ? "Có sẵn" : "Không có sẵn"}
                </Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full hover:bg-green-400 cursor-pointer"
                variant={`${
                  item.status == "available" ? "destructive" : "outline"
                }`}
                onClick={() => {
                  changeLendStatus(item._id);
                }}
              >
                {item.status == "available" ? "Stop lend" : "Lends"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MySupplies;
