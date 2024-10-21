import { useState } from 'react'
import moment from 'moment'
import { useQuery } from '@apollo/client'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, CreditCard, Search, ChevronDown, ChevronUp, Truck, ShoppingBag } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { gql } from '@apollo/client'
import Empty, { ErrorMessage, LoadingSpinner } from '../../useAble/LoadAndErrorStatus'

interface PurchaseItem {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl: string
}

interface Purchase {
  id: string
  date: string // use string because date is serialized in GraphQL responses
  items: PurchaseItem[]
  status: 'Delivered' | 'Shipped' | 'Processing'
  trackingNumber?: string
}

const GET_PURCHASE_HISTORY = gql`
  query PurchaseHistory {
    purchaseHistory {
      id
      date
      status
      trackingNumber
      items {
        id
        name
        price
        quantity
        imageUrl
      }
    }
  }
`

const statusColors = {
  'Delivered': 'bg-green-500',
  'Shipped': 'bg-blue-500',
  'Processing': 'bg-yellow-500',
}

export default function CartHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])

  // Fetch purchase history data
  const { loading, error, data } = useQuery<{ purchaseHistory: Purchase[] }>(GET_PURCHASE_HISTORY)


  const purchaseHistory = data?.purchaseHistory || []

  const filteredHistory = purchaseHistory.filter((purchase) => 
    purchase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  return (
    <Card className="w-full max-w-6xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-3xl font-bold flex items-center">
            <ShoppingBag className="mr-2 h-8 w-8" /> Your Purchase History
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 w-64 bg-white/20 border-white/30 text-white placeholder-white/70"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      {error && <ErrorMessage message="Error loading purchase history" />}
      {loading && <LoadingSpinner />}
      {!loading && !error && purchaseHistory.length === 0 && (
        <Empty message="No purchase history available yet. Please make a purchase." />
      )}
      {!loading && !error && purchaseHistory.length > 0 && (
      <CardContent className="p-0">
        <ScrollArea className="h-[700px]">
          {filteredHistory.map((purchase) => (
            <div key={purchase.id} className="p-6 border-b border-gray-200 last:border-b-0 transition-all duration-300 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Order {purchase.id}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Calendar className="mr-1 h-4 w-4" />
                    {moment(purchase.date).format('MMMM D, YYYY')}
                  </div>
                  {purchase.trackingNumber && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Truck className="mr-1 h-4 w-4" />
                      Tracking: {purchase.trackingNumber}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <Badge className={`${statusColors[purchase.status]} text-white mb-2 px-3 py-1 rounded-full`}>
                    {purchase.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleOrderExpansion(purchase.id)}
                    className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                  >
                    {expandedOrders.includes(purchase.id) ? (
                      <>Hide Details <ChevronUp className="ml-1 h-4 w-4" /></>
                    ) : (
                      <>Show Details <ChevronDown className="ml-1 h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              </div>
              {expandedOrders.includes(purchase.id) && (
                <div className="mt-4 space-y-4 animate-fadeIn">
                  {purchase.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex items-center space-x-4">
                        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <CreditCard className="mr-1 h-4 w-4" />
                      Payment Method: **** 1234
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      Total: $
                      {purchase.items
                        .reduce((sum, item) => sum + item.price * item.quantity, 0)
                        .toFixed(2)}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50">View Invoice</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Invoice for Order {purchase.id}</DialogTitle>
                          <DialogDescription>
                            Here's a detailed breakdown of your order.
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <Button variant="solid" className="bg-indigo-600 text-white">Track Shipment</Button>
                  </div>
                </div>
              )}
            </div>
          ))} 
        </ScrollArea>
      </CardContent>
      )}  
    </Card>
  )
}
