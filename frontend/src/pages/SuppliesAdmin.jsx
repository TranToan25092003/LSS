import { ItemCard } from "@/components/reviews/ItemCard";
import { Button } from "@/components/ui/button";
import { customFetch } from "@/utils/customAxios";
import React, { useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { MdBlock } from "react-icons/md";
import { Reason } from "@/components/reviews/Reason";
import Swal from "sweetalert2";
import Loading from "@/components/global/Loading";

export const suppliesLoader = async () => {
  try {
    const { data } = await customFetch("/admin/reviews/items?status=approved");

    return {
      data: data.data,
      status: "approved",
    };
  } catch (error) {}
};

export const suppliesRejectLoader = async () => {
  try {
    const { data } = await customFetch(
      "/admin/reviews/items/?status=rejected",
      {
        status: "rejected",
      }
    );

    return {
      data: data.data,
      status: "rejected",
    };
  } catch (error) {}
};

const SuppliesAdmin = () => {
  const { data, status } = useLoaderData();
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
        const { data } = await customFetch.put("/admin/reviews", {
          lendId,
          status: "approved",
        });

        await Swal.fire({
          title: "Thành công!",
          text: "Đã phê duyệt ",
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Danh sách vật phẩm
      </h1>
      <div className="max-w-4xl mx-auto space-y-4">
        {data.map((item) => {
          return (
            <ItemCard
              key={item._id}
              lendId={item._id}
              item={item.item}
              status={item.status}
              rejectReason={item.rejectReason}
            >
              {status == "approved" && (
                <Reason url={"/admin/reviews"} lendId={item._id}>
                  <Button variant={"destructive"}>
                    Block <MdBlock></MdBlock>{" "}
                  </Button>
                </Reason>
              )}

              {status == "rejected" && (
                <Button
                  className={"mb-2 cursor-pointer bg-green-500"}
                  variant={"default"}
                  onClick={() => {
                    handleApprove(item._id);
                  }}
                  disabled={submit}
                >
                  {submit ? <Loading></Loading> : "Approved"}
                </Button>
              )}
            </ItemCard>
          );
        })}
      </div>
    </div>
  );
};

export default SuppliesAdmin;
