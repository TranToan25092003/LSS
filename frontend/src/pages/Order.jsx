import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Order = () => {
  const borrowOrders = [
    {
      id: "BOR001",
      borrowerClerkId: "user123",
      item: {
        name: "Laptop Dell XPS",
        category: "Electronics",
        price: 50.0,
        rate: "day",
      },
      totalTime: 3,
      totalPrice: 150.0,
      createdAt: "2024-04-23",
      status: "pending",
    },
    {
      id: "BOR002",
      borrowerClerkId: "user124",
      item: {
        name: "Camera Sony A7III",
        category: "Photography",
        price: 100.0,
        rate: "day",
      },
      totalTime: 2,
      totalPrice: 200.0,
      createdAt: "2024-04-22",
      status: "approved",
    },
  ];

  const lendOrders = [
    {
      id: "LEN001",
      item: {
        name: "MacBook Pro",
        category: "Electronics",
        price: 80.0,
        rate: "day",
      },
      status: "pending",
      createdAt: "2024-04-23",
    },
    {
      id: "LEN002",
      item: {
        name: "Drone DJI Mini 3",
        category: "Electronics",
        price: 120.0,
        rate: "day",
      },
      status: "approved",
      createdAt: "2024-04-21",
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500 text-white";
      case "approved":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price, rate) => {
    return `$${price.toFixed(2)}/${rate}`;
  };

  const handleApprove = (orderId) => {
    console.log("Approving order:", orderId);
  };

  const handleReject = (orderId) => {
    console.log("Rejecting order:", orderId);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="borrow" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="borrow">Items I'm Borrowing</TabsTrigger>
              <TabsTrigger value="lend">Items I'm Lending</TabsTrigger>
            </TabsList>

            <TabsContent value="borrow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.item.name}</TableCell>
                      <TableCell>{order.item.category}</TableCell>
                      <TableCell>{order.totalTime} days</TableCell>
                      <TableCell>
                        {formatPrice(order.item.price, order.item.rate)}
                      </TableCell>
                      <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="lend">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lendOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.item.name}</TableCell>
                      <TableCell>{order.item.category}</TableCell>
                      <TableCell>
                        {formatPrice(order.item.price, order.item.rate)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        {order.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-green-500 text-white hover:bg-green-600"
                              onClick={() => handleApprove(order.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-red-500 text-white hover:bg-red-600"
                              onClick={() => handleReject(order.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Order;
