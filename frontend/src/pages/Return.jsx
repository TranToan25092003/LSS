import { useState } from "react";
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

const fakeReturns = [
  {
    _id: "1",
    ownerConfirm: true,
    borrowerConfirm: true,
    borrow: "Borrow001",
    timeReturned: new Date("2025-04-20T10:00:00Z"),
    overTime: 0,
    createdAt: new Date("2025-04-20T09:00:00Z"),
  },
  {
    _id: "2",
    ownerConfirm: false,
    borrowerConfirm: true,
    borrow: "Borrow002",
    timeReturned: new Date("2025-04-19T15:30:00Z"),
    overTime: 2,
    createdAt: new Date("2025-04-19T14:00:00Z"),
  },
  {
    _id: "3",
    ownerConfirm: true,
    borrowerConfirm: false,
    borrow: "Borrow003",
    timeReturned: null,
    overTime: 5,
    createdAt: new Date("2025-04-18T08:00:00Z"),
  },
];

function Return() {
  const [returns, setReturns] = useState(fakeReturns);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Return Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Borrow ID</TableHead>
            <TableHead>Owner Confirmed</TableHead>
            <TableHead>Borrower Confirmed</TableHead>
            <TableHead>Time Returned</TableHead>
            <TableHead>Overdue (Days)</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {returns.map((returnItem) => (
            <TableRow key={returnItem._id}>
              <TableCell>{returnItem.borrow}</TableCell>
              <TableCell>
                <Badge
                  variant={returnItem.ownerConfirm ? "success" : "destructive"}
                >
                  {returnItem.ownerConfirm ? "Yes" : "No"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    returnItem.borrowerConfirm ? "success" : "destructive"
                  }
                >
                  {returnItem.borrowerConfirm ? "Yes" : "No"}
                </Badge>
              </TableCell>
              <TableCell>
                {returnItem.timeReturned
                  ? new Date(returnItem.timeReturned).toLocaleString()
                  : "Not Returned"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={returnItem.overTime > 0 ? "destructive" : "default"}
                >
                  {returnItem.overTime}
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
