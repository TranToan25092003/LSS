import { useEffect, useRef, useState } from "react";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { faker } from "@faker-js/faker";
import { ItemSchema, validateWithZodSchema } from "@/utils/schema";
import Swal from "sweetalert2";
import { customFetch } from "@/utils/customAxios";
import clerk from "@/utils/clerk";

export const lendLoader = () => {
  try {
    if (!clerk.isSignedIn) {
      toast("You must login first", {
        description: "Login please",
      });
      return redirect("/");
    }
  } catch (error) {
    toast(error?.message || "error");
  }
};

export default function Lends() {
  const location = useLocation();
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: faker.person.firstName(),
    category: faker.commerce.department(),
    images: imageFiles,
    description: faker.lorem.paragraph(),
    price: faker.number.int({ min: 1, max: 100000 }),
    rate: faker.helpers.arrayElement(["day", "hour"]),
    isFree: faker.datatype.boolean({ probability: 1 }),

    status: faker.helpers.arrayElement(["available", "notAvailable"]),
  });

  const cloudinaryRef = useRef();
  const widgeRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgeRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_PRESET_NAME,
        sources: ["local", "url", "camera"],
        resourceType: "image",
        clientAllowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
        maxFileSize: 5000000, // 5MB limit
      },
      (error, result) => {
        if (result.event == "success") {
          setImageFiles((prevState) => {
            return [...prevState, result.info.url];
          });
        }
      }
    );
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = validateWithZodSchema(ItemSchema, formData);

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
        await Swal.fire({
          title: "Thành công!",
          text: "",
          icon: "success",
          confirmButtonColor: "#22c55e",
        });
        const response = await customFetch.post("/lends", {
          ...data,
          images: imageFiles,
        });
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast("error", {
        description: error?.message || "error",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter item name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter category"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex">
                <Label htmlFor="images" className={"mr-2"}>
                  Images
                </Label>
                <Button
                  variant={"outline"}
                  className={"cursor-pointer"}
                  type="button"
                  size={"lg"}
                  onClick={() => {
                    widgeRef.current.open();
                  }}
                >
                  Upload
                </Button>
              </div>
              {imageFiles.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {imageFiles.map((url) => {
                    return (
                      <div
                        key={url}
                        className="flex flex-col items-center mb-2 py-0.5"
                      >
                        <img
                          src={url}
                          alt={`image`}
                          className="w-20 h-20 object-cover rounded mb-2"
                        ></img>
                        <Button
                          variant={"destructive"}
                          size={"icon"}
                          className={"cursor-pointer hover:bg-red-800"}
                          onClick={() => {
                            const newImageArr = imageFiles.filter((img) => {
                              return img != url;
                            });

                            setImageFiles(newImageArr);
                          }}
                        >
                          X
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter item description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Rate</Label>
                <Select
                  name="rate"
                  value={formData.rate}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, rate: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Per Day</SelectItem>
                    <SelectItem value="hour">Per Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFree"
                checked={formData.isFree}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isFree: checked }))
                }
              />
              <Label htmlFor="isFree">Is Free?</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select status"
                    selected="available"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="notAvailable">Not Available</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/items")}
              >
                Cancel
              </Button>
              <Button type="submit">Create Item</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
