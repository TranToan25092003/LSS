import Loading from "@/components/global/Loading";
import { ItemCard } from "@/components/reviews/ItemCard";
import { Reason } from "@/components/reviews/Reason";
import { Button } from "@/components/ui/button";
import clerk from "@/utils/clerk";
import { customFetch } from "@/utils/customAxios";

import React, { useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Swal from "sweetalert2";

export const reviewLoader = async () => {
  try {
    console.log("9999");
    const token = await clerk.session.getToken();

    const { data } = await customFetch.get("/admin/reviews", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      data: data.data,
    };
  } catch (error) {
    console.log(error);
    if (error?.message) {
      toast(error.message);
    }
  }
};

const Review = () => {
  const { data } = useLoaderData();
  const [submit, setSubmit] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleApprove = async (lendId) => {
    const result = await Swal.fire({
      title: "Xác nhận phê duyệt",
      text: "Bạn có chắc chắn muốn phê duyệt không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Phê duyệt",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      // Fake action
      setSubmit(true);

      try {
        const response = await customFetch.put("/admin/reviews", {
          lendId,
          status: "approved",
        });
        console.log(response);
        await Swal.fire({
          title: "Thành công!",
          text: "Đã phê duyệt .",
          icon: "success",
          confirmButtonColor: "#22c55e",
        });

        navigate(location.pathname, { replace: true });

        setSubmit(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // layout
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Danh sách vật phẩm
      </h1>
      <div className="max-w-4xl mx-auto space-y-4">
        {data.map((lend) => {
          if (lend.status == "pending")
            return (
              <ItemCard
                key={lend._id}
                lendId={lend._id}
                item={lend.item}
                status={lend.status}
              >
                <>
                  <Button
                    className={"mb-2 cursor-pointer bg-green-500"}
                    variant={"default"}
                    onClick={() => {
                      handleApprove(lend._id);
                    }}
                    disabled={submit}
                  >
                    {submit ? <Loading></Loading> : "Approved"}
                  </Button>
                  <Reason url="/admin/reviews" lendId={lend._id}>
                    <Button
                      className={"mb-2 cursor-pointer hover:bg-red-800"}
                      variant={"destructive"}
                      url={"/admin/reviews"}
                    >
                      Reject
                    </Button>
                  </Reason>
                </>
              </ItemCard>
            );
        })}
      </div>
    </div>
  );
};

export default Review;
