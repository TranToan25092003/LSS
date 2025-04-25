import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function SupplyCard() {
  const product = {
    _id: "671c6b2c9f1a2b3c4d5e6f11",
    name: "Electric Guitar",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGsOfcTf2FZDj2eBCE3f61TxRixxchWL6q2hBaXRw4fRMSxg28d3mnEEgvgwoowrypiAI&usqp=CAU",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGsOfcTf2FZDj2eBCE3f61TxRixxchWL6q2hBaXRw4fRMSxg28d3mnEEgvgwoowrypiAI&usqp=CAU",
    ],
    description: "A high-quality electric guitar perfect for beginners.",
    price: 150,
    rate: "day",
    isFree: false,
    ownerClerkId: {
      name: "toàn",
      email: "abc@gmail.com",
      ImageUrl:
        "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ydXU0RkYzV2VWV0J3RHdBRmVpM3pJc2F3SDEifQ",
    },
    status: "available",
    createdAt: "2025-04-20T10:00:00Z",
    updatedAt: "2025-04-20T10:00:00Z",
  };

  return (
    <Card className=" mx-auto overflow-hidden rounded-lg shadow-lg">
      {/* Product Image */}
      <div className="relative h-48 w-full">
        <img
          src={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGsOfcTf2FZDj2eBCE3f61TxRixxchWL6q2hBaXRw4fRMSxg28d3mnEEgvgwoowrypiAI&usqp=CAU"
          }
          alt={product.name}
          className="object-fit h-48 w-full"
        ></img>
      </div>

      {/* Product Info */}
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {product.status === "available" ? (
                <span className="text-green-500">Available</span>
              ) : (
                <span className="text-red-500">Unavailable</span>
              )}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">
              ${product.price} / {product.rate}
            </p>
            {product.isFree && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Free
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-700 mb-4">{product.description}</p>

        {/* Owner Info */}
        <div className="flex items-center space-x-3 mt-4 pt-4 border-t">
          <Avatar>
            <AvatarImage src={product.ownerClerkId.ImageUrl} />
            <AvatarFallback>
              {product.ownerClerkId.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{product.ownerClerkId.name}</p>
            <p className="text-sm text-gray-500">
              {product.ownerClerkId.email}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between text-sm text-gray-500">
        <span>Posted: {new Date(product.createdAt).toLocaleDateString()}</span>
        <span>
          Last updated: {new Date(product.updatedAt).toLocaleDateString()}
        </span>
      </CardFooter>
    </Card>
  );
}
