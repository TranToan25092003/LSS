"use client"
import axios from "axios"
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { formatPrice } from "../lib/utils"
import { ArrowLeft, Calendar, Clock, DollarSign, Info, User } from "lucide-react"

export default function ItemDetailPage() {
  const { itemId } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [borrowDuration, setBorrowDuration] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/items/${itemId}`)
        const data = response.data
        setItem(data)
        setTotalPrice(data.isFree ? 0 : data.price)
      } catch (error) {
        console.error("Error fetching item:", error.response?.data?.message || error.message)
        navigate("/")
      } finally {
        setIsLoading(false)
      }
    }
  
    if (itemId) {
      fetchItem()
    }
  }, [itemId, navigate])

  const handleDurationChange = (e) => {
    const duration = parseInt(e.target.value) || 1
    setBorrowDuration(duration)
    if (item && !item.isFree) {
      setTotalPrice(item.price * duration)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">Item not found</h3>
          <p className="mt-2 text-gray-500">The item you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="mt-4">
            <Link to="/">Back to Items</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { name, category, images, description, price, rate, isFree, status, ownerClerkId, createdAt } = item
  const statusColor = status === "available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  const defaultImage = "/placeholder.svg?height=400&width=600"
  const displayImage = images && images.length > 0 ? images[0] : defaultImage
  const rateText = rate === "day" ? "day" : "giờ"
  const formattedDate = new Date(createdAt).toLocaleDateString()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Items
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden">
            <img src={displayImage} alt={name} className="object-cover w-full h-full" />
          </div>
        </div>

        <div>
          <Card className="p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold">{name}</h1>
              <div className="flex items-center mt-2">
                <Badge className={statusColor}>{status === "available" ? "Available" : "Not Available"}</Badge>
                <span className="ml-2 text-sm text-muted-foreground">{category}</span>
              </div>
            </div>

            <div className="border-t border-b py-4 my-4">
              <div className="text-2xl font-bold mb-1">{isFree ? "FREE" : `${formatPrice(price)}/${rateText}`}</div>
              <p className="text-sm text-muted-foreground">
                {isFree ? "This item is available for free" : `Price is per ${rate}`}
              </p>
            </div>

            {status === "available" ? (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Borrow Duration ({rateText}s)</Label>
                  <Input id="duration" type="number" min="1" value={borrowDuration} onChange={handleDurationChange} />
                </div>

                <div className="flex justify-between items-center font-medium">
                  <span>Total Price:</span>
                  <span>{isFree ? "FREE" : formatPrice(totalPrice)}</span>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">Borrow Now</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Borrowing</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex justify-between items-center">
                        <span>Item:</span>
                        <span className="font-medium">{name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Duration:</span>
                        <span>
                          {borrowDuration} {rateText}
                          {borrowDuration > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Total Price:</span>
                        <span className="font-bold">{isFree ? "FREE" : formatPrice(totalPrice)}</span>
                      </div>
                      <div className="pt-4 border-t">
                        <Button className="w-full">Confirm and Pay</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <Button disabled className="w-full">
                Not Available
              </Button>
            )}
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="owner">Owner</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="p-4 border rounded-md mt-2">
            <h3 className="text-lg font-medium mb-2">About this item</h3>
            <p>{description || "No description available for this item."}</p>
          </TabsContent>
          <TabsContent value="details" className="p-4 border rounded-md mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailIcon icon={<Calendar />} label="Listed On" value={formattedDate} />
              <DetailIcon icon={<Clock />} label="Rate Type" value={`Per ${rate}`} />
              <DetailIcon icon={<DollarSign />} label="Price" value={isFree ? "Free" : formatPrice(price)} />
              <DetailIcon icon={<Info />} label="Status" value={status === "available" ? "Available" : "Not Available"} />
            </div>
          </TabsContent>
          <TabsContent value="owner" className="p-4 border rounded-md mt-2">
            <div className="flex items-start gap-4">
              <div className="bg-gray-200 rounded-full h-12 w-12 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium">Owner ID</h4>
                <p className="text-sm text-muted-foreground">{ownerClerkId}</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Contact Owner
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Component phụ cho chi tiết trong tab
function DetailIcon({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div>
        <h4 className="font-medium">{label}</h4>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  )
}
