"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import clerk from "@/utils/clerk";
import { redirect } from "react-router-dom";
import {
  Search,
  Plus,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const mySuppliesLoader = async () => {
  try {
    if (!clerk.isSignedIn) {
      toast("You must sign in first", {
        description: "Please sign in",
      });
      return redirect("/");
    }

    const { data } = await customFetch.get("/lends/supplies");

    return {
      data: data.data,
    };
  } catch {
    toast("Error loading data");
  }
};

const changeLendStatus = async (itemId, currentStatus, navigate) => {
  const newStatus =
    currentStatus === "available" ? "notAvailable" : "available";
  const actionText = currentStatus === "available" ? "Stop lending" : "Lend";

  const result = await Swal.fire({
    title: "Confirm",
    text: `Do you want to ${actionText} this item?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: actionText,
    cancelButtonText: "Cancel",
    background: "#ffffff",
    customClass: {
      confirmButton: "swal-confirm-button",
      cancelButton: "swal-cancel-button",
    },
  });

  if (result.isConfirmed) {
    try {
      await customFetch.put(`/items/update/${itemId}`, { status: newStatus });
      toast("Success", {
        description: `Item has been ${actionText.toLowerCase()}ed`,
      });
      if (typeof navigate === "function") {
        navigate(0); // Reload the page
      } else {
        console.warn(
          "navigate is not a function, page will not reload automatically."
        );
        // Fallback: Manually reload the page using window.location
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast("Error", { description: "Could not update item status" });
    }
  }
};

const formSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }),
  category: z.string().min(1, { message: "Category cannot be empty" }),
  description: z.string(),
  price: z.coerce.number().min(0, { message: "Price cannot be negative" }),
  isFree: z.boolean().default(false),
  rate: z.string(),
  status: z.enum(["available", "unavailable"]),
  images: z.string(),
});

const EditItemModal = ({ item, isOpen, onClose }) => {
  const navigate = useNavigate();

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
  });

  const onSubmit = async (values) => {
    try {
      const updatedData = {
        ...values,
        images: values.images
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean),
      };

      await customFetch.put(`/items/update/${item._id}`, updatedData);
      toast("Success", { description: "Item has been updated" });
      onClose();
      navigate(0);
    } catch (error) {
      console.error("Error updating item:", error);
      toast("Error", { description: "Could not update item" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Item</DialogTitle>
          <DialogDescription>
            Update your item information. Click save when done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Item name" {...field} />
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
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Category" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the item"
                      className="resize-none"
                      {...field}
                    />
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
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Price"
                        {...field}
                        disabled={form.watch("isFree")}
                      />
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
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Free</FormLabel>
                    <FormDescription>
                      Check if this item is lent for free
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
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
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Image URLs, separated by commas"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter image URLs, separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const MySupplies = () => {
  const { data } = useLoaderData();
  const navigate = useNavigate();

  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // Initialize filtered data when component mounts
  useEffect(() => {
    if (data) {
      setFilteredData(data);
      setIsLoading(false);
    }
  }, [data]);

  // Filter data based on search term and active tab
  useEffect(() => {
    if (!data) return;

    let result = data;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        ({ item }) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tab filter
    if (activeTab === "available") {
      result = result.filter(({ item }) => item.status === "available");
    } else if (activeTab === "unavailable") {
      result = result.filter(({ item }) => item.status === "notAvailable");
    } else if (activeTab === "free") {
      result = result.filter(({ item }) => item.isFree);
    }

    setFilteredData(result);
  }, [searchTerm, data, activeTab]);

  const handleEdit = async (itemId) => {
    try {
      const { data: itemData } = await customFetch.get(`/items/${itemId}`);

      setCurrentItem(itemData.item);
      setEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching item details:", error);
      toast("Error", { description: "Could not fetch item details" });
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const result = await Swal.fire({
        title: "Confirm Deletion",
        text: "Are you sure you want to delete this item? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        background: "#ffffff",
        customClass: {
          confirmButton: "swal-confirm-button",
          cancelButton: "swal-cancel-button",
        },
      });

      if (result.isConfirmed) {
        await customFetch.delete(`/items/delete/${itemId}`);
        toast("Success", { description: "Item has been deleted" });
        navigate(0);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast("Error", { description: "Could not delete item" });
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    navigate(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-8 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              My Supplies
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your items available for lending
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search items..."
                className="pl-10 pr-4 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              onClick={() =>
                toast("Feature coming soon", {
                  description: "Add item functionality will be available soon",
                })
              }
            >
              <Plus size={18} className="mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-gray-100 dark:bg-gray-800">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  All Items
                </TabsTrigger>
                <TabsTrigger
                  value="available"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  Available
                </TabsTrigger>
                <TabsTrigger
                  value="unavailable"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  Unavailable
                </TabsTrigger>
                <TabsTrigger
                  value="free"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  Free Items
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast("Feature coming soon")}
                >
                  <Filter size={16} className="mr-2" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw
                    size={16}
                    className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card
                      key={i}
                      className="flex flex-col h-[400px] animate-pulse"
                    >
                      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                      <CardContent className="flex-1 pt-6">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : filteredData.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No items found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    {searchTerm
                      ? `No items match your search "${searchTerm}". Try different keywords.`
                      : "You don't have any items in this category yet."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.map(({ item }) => (
                    <Card
                      key={item._id}
                      className="flex flex-col h-full overflow-hidden group hover:shadow-lg transition-shadow duration-300 border-gray-200 dark:border-gray-700"
                    >
                      <CardHeader className="p-0 overflow-hidden">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={
                              item.images && item.images[0]
                                ? item.images[0]
                                : "https://via.placeholder.com/300x200?text=No+Image"
                            }
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-3 right-3">
                            <Badge
                              variant={
                                item.status === "available"
                                  ? "default"
                                  : "destructive"
                              }
                              className={`
                                ${
                                  item.status === "available"
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-red-500 hover:bg-red-600"
                                }
                              `}
                            >
                              {item.status === "available"
                                ? "Available"
                                : "Unavailable"}
                            </Badge>
                          </div>
                          {item.isFree && (
                            <div className="absolute top-3 left-3">
                              <Badge
                                variant="secondary"
                                className="bg-purple-500 text-white hover:bg-purple-600"
                              >
                                Free
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 pt-6">
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-xl font-bold">
                            {item.name}
                          </CardTitle>
                        </div>
                        <Badge variant="outline" className="mb-3">
                          {item.category}
                        </Badge>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {item.description}
                        </p>
                        {!item.isFree && (
                          <p className="font-medium text-lg text-purple-600 dark:text-purple-400">
                            {item.price.toLocaleString()} VNĐ
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {" "}
                              / {item.rate}
                            </span>
                          </p>
                        )}
                      </CardContent>
                      <CardFooter className="flex gap-2 pt-2 pb-4">
                        <Button
                          className={`flex-1 ${
                            item.status === "available"
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                          onClick={() =>
                            changeLendStatus(item._id, item.status, navigate)
                          }
                        >
                          {item.status === "available" ? (
                            <>
                              <X size={16} className="mr-1" />
                              Stop Lending
                            </>
                          ) : (
                            <>
                              <Check size={16} className="mr-1" />
                              Lend
                            </>
                          )}
                        </Button>
                        <Button
                          className="flex-1 bg-blue-500 hover:bg-blue-600"
                          onClick={() => handleEdit(item._id)}
                        >
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 size={16} className="mr-1" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="available" className="m-0">
              {/* Content is dynamically filtered by the useEffect */}
            </TabsContent>

            <TabsContent value="unavailable" className="m-0">
              {/* Content is dynamically filtered by the useEffect */}
            </TabsContent>

            <TabsContent value="free" className="m-0">
              {/* Content is dynamically filtered by the useEffect */}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {editModalOpen && (
        <EditItemModal
          item={currentItem}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
        />
      )}

      <style jsx global>{`
        .swal-confirm-button {
          background: linear-gradient(to right, #8b5cf6, #ec4899) !important;
          color: white !important;
        }

        .swal-cancel-button {
          background: #f3f4f6 !important;
          color: #1f2937 !important;
        }

        /* Animation for card appearance */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card {
          animation: fadeInUp 0.3s ease-out forwards;
        }

        /* Staggered animation for cards */
        .grid > *:nth-child(1) {
          animation-delay: 0.05s;
        }
        .grid > *:nth-child(2) {
          animation-delay: 0.1s;
        }
        .grid > *:nth-child(3) {
          animation-delay: 0.15s;
        }
        .grid > *:nth-child(4) {
          animation-delay: 0.2s;
        }
        .grid > *:nth-child(5) {
          animation-delay: 0.25s;
        }
        .grid > *:nth-child(6) {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default MySupplies;
