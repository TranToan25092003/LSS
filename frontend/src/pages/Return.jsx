import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { customFetch } from "@/utils/customAxios"; // Import custom fetch utility

function Return() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReturns = async () => {
    try {
      const response = await customFetch.get("/return/all");
      setReturns(response.data.data);
      console.log(response.data);
    } catch (error) {
      setError("Failed to fetch return records");
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (borrowId, type, confirmStatus) => {
    try {
      // API endpoint để xác nhận theo owner hoặc borrower
      const endpoint =
        type === "owner"
          ? `/return/owner-confirm`
          : `/return/borrower-confirm`;

      // Gửi status confirm (true or false) theo type (owner/borrower)
      const response = await customFetch.post(endpoint, {
        borrowId,
        confirmStatus,  // true or false
      });
      console.log(response.data); // In ra kết quả trả về từ backend
      console.log(borrowId);

      // Cập nhật state với kết quả trả về từ backend
      setReturns((prevReturns) =>
        prevReturns.map((returnItem) =>
          returnItem._id === borrowId
            ? { ...returnItem, [type + "Confirm"]: confirmStatus }
            : returnItem
        )
      );

      console.log(response.data.message); // In message từ backend

    } catch (error) {
      console.log(error);
      setError("Failed to update confirmation");
    }
  };
  const handleOwnerConfirm = async (itemId, type, confirmStatus) => {
    try {
      // API endpoint để xác nhận theo owner hoặc borrower
      const endpoint =
        type === "owner"
          ? `/return/owner-confirm`
          : `/return/borrower-confirm`;

      // Gửi status confirm (true or false) theo type (owner/borrower)
      const response = await customFetch.post(endpoint, {
        itemId,
        confirmStatus,  // true or false
      });
      console.log(response.data); // In ra kết quả trả về từ backend
      console.log(itemId);

      // Cập nhật state với kết quả trả về từ backend
      setReturns((prevReturns) =>
        prevReturns.map((returnItem) =>
          returnItem.itemId === itemId
            ? { ...returnItem, [type + "Confirm"]: confirmStatus }
            : returnItem
        )
      );

      console.log(response.data.message); // In message từ backend

    } catch (error) {
      console.log(error);
      setError("Failed to update confirmation");
    }
  };


  useEffect(() => {
    fetchReturns();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Return Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Owner Confirmed</TableHead>
            <TableHead>Borrower Confirmed</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time Returned</TableHead>
            <TableHead>Overdue (Days)</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {returns.map((returnItem) => (
            <TableRow key={returnItem._id}>
              <TableCell>
                <Badge
                  variant={returnItem.ownerConfirm ? "success" : "destructive"}
                >
                  {returnItem.ownerConfirm ? "Yes" : "No"}
                </Badge>
                {!returnItem.ownerConfirm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleOwnerConfirm(returnItem.itemId, "owner", true)
                    }
                  // disabled={returnItem.borrowerConfirm}
                  >
                    Confirm
                  </Button>
                )}
                {returnItem.ownerConfirm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleOwnerConfirm(returnItem.itemId, "owner", false)
                    }
                    disabled={returnItem.borrowerConfirm}
                  >
                    Undo Confirm
                  </Button>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={returnItem.borrowerConfirm ? "success" : "destructive"}
                >
                  {returnItem.borrowerConfirm ? "Yes" : "No"}
                </Badge>
                {!returnItem.borrowerConfirm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleConfirm(returnItem._id, "borrower", true)
                    }
                    disabled={returnItem.ownerConfirm}
                  >
                    Confirm
                  </Button>
                )}
                {returnItem.borrowerConfirm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleConfirm(returnItem._id, "borrower", false)
                    }
                    disabled={returnItem.ownerConfirm}
                  >
                    Undo Confirm
                  </Button>
                )}
              </TableCell>
              <TableCell>{returnItem.itemStatus}</TableCell>

              <TableCell>
                {returnItem.timeReturned
                  ? new Date(returnItem.timeReturned).toLocaleString()
                  : "Not Returned"}
              </TableCell>
              <TableCell>
                <Badge variant={returnItem.overTime > 0 ? "destructive" : "default"}>
                  {returnItem.overTime > 0 ? returnItem.overTime + "" : "No Overdue"}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(returnItem.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Return;
