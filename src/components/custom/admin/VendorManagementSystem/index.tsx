import React, { useState } from 'react'
import { Search, ChevronDown, ChevronUp, ChevronRight, Phone, Mail,  Download,  MessageSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface OrderItem {
  id: number
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customerId: string
  customerName: string
  date: string
  deliveryAddress: string
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  paymentStatus: 'paid' | 'unpaid'
  paymentMethod: string
  shippingMethod: string
  trackingNumber: string
  estimatedDeliveryDate: string
}

interface ItemComment {
  id: number
  text: string
  rating: number
}

interface Item {
  id: number
  name: string
  price: number
  stock: number
  comments: ItemComment[]
}

interface Vendor {
  id: number
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'pending'
  orders: Order[]
  shopItems: Item[]
  lastOrderDate: string
  totalOrders: number
}

const initialVendors: Vendor[] = [
  {
    id: 1,
    name: "Acme Corp",
    email: "contact@acme.com",
    phone: "123-456-7890",
    status: 'active',
    orders: [
      {
        id: "ORD001",
        customerId: "CUST001",
        customerName: "John Doe",
        date: "2023-09-15",
        deliveryAddress: "123 Main St, Anytown, AN 12345",
        status: 'delivered',
        items: [
          { id: 1, name: "Widget A", quantity: 100, price: 10.99 },
          { id: 2, name: "Gadget B", quantity: 50, price: 24.99 },
        ],
        paymentStatus: 'paid',
        paymentMethod: 'Credit Card',
        shippingMethod: 'Express',
        trackingNumber: 'TRACK123456',
        estimatedDeliveryDate: '2023-09-20',
      },
      {
        id: "ORD002",
        customerId: "CUST002",
        customerName: "Jane Smith",
        date: "2023-09-20",
        deliveryAddress: "456 Elm St, Othertown, OT 67890",
        status: 'shipped',
        items: [
          { id: 2, name: "Gadget B", quantity: 25, price: 24.99 },
        ],
        paymentStatus: 'unpaid',
        paymentMethod: 'PayPal',
        shippingMethod: 'Standard',
        trackingNumber: 'TRACK789012',
        estimatedDeliveryDate: '2023-09-25',
      }
    ],
    shopItems: [
      { id: 1, name: "Widget A", price: 10.99, stock: 500, comments: [
        { id: 1, text: "Great quality for the price!", rating: 5 },
        { id: 2, text: "Arrived quickly, works well", rating: 4 }
      ] },
      { id: 2, name: "Gadget B", price: 24.99, stock: 250, comments: [
        { id: 3, text: "A bit pricey, but worth it", rating: 4 },
        { id: 4, text: "Could use better instructions", rating: 3 }
      ] },
      { id: 3, name: "Gizmo C", price: 15.99, stock: 100, comments: [
        { id: 5, text: "Exactly what I needed", rating: 5 }
      ] },
    ],
    lastOrderDate: "2023-09-20",
    totalOrders: 2,
  },
  {
    id: 2,
    name: "Globex Corporation",
    email: "info@globex.com",
    phone: "098-765-4321",
    status: 'inactive',
    orders: [
      {
        id: "ORD003",
        customerId: "CUST003",
        customerName: "Alice Johnson",
        date: "2023-08-22",
        deliveryAddress: "789 Oak St, Somewhere, SW 13579",
        status: 'processing',
        items: [
          { id: 4, name: "Thingamajig C", quantity: 75, price: 15.99 },
        ],
        paymentStatus: 'paid',
        paymentMethod: 'Bank Transfer',
        shippingMethod: 'Standard',
        trackingNumber: 'Not Available',
        estimatedDeliveryDate: '2023-08-29',
      }
    ],
    shopItems: [
      { id: 4, name: "Thingamajig C", price: 15.99, stock: 300, comments: [
        { id: 6, text: "Good value for money", rating: 4 },
        { id: 7, text: "Shipping was slow", rating: 2 }
      ] },
      { id: 5, name: "Doohickey D", price: 19.99, stock: 150, comments: [
        { id: 8, text: "Impressive build quality", rating: 5 },
        { id: 9, text: "A bit complicated to use at first", rating: 3 }
      ] },
    ],
    lastOrderDate: "2023-08-22",
    totalOrders: 1,
  },
]

export default function EnhancedVendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedVendor, setExpandedVendor] = useState<number | null>(null)
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [orderSearchTerm, setOrderSearchTerm] = useState('')

  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleVendorExpansion = (vendorId: number) => {
    setExpandedVendor(expandedVendor === vendorId ? null : vendorId)
  }

  const updateVendorStatus = (vendorId: number, newStatus: 'active' | 'inactive' | 'pending') => {
    setVendors(vendors.map(vendor => 
      vendor.id === vendorId ? { ...vendor, status: newStatus } : vendor
    ))
  }

  const getStatusBadge = (status: 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    switch (status) {
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>
      case 'shipped':
        return <Badge variant="default">Shipped</Badge>
      case 'delivered':
        return <Badge variant="outline">Delivered</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
    }
  }

  const getPaymentStatusBadge = (status: 'paid' | 'unpaid') => {
    return status === 'paid' ? 
      <Badge variant="default">Paid</Badge> : 
      <Badge variant="destructive">Unpaid</Badge>
  }

  const filterOrders = (orders: Order[]) => {
    return orders.filter(order => {
      const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter
      const matchesDateRange = (!dateRange.from || new Date(order.date) >= dateRange.from) &&
                               (!dateRange.to || new Date(order.date) <= dateRange.to)
      const matchesSearch = order.id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                            order.customerName.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                            order.items.some(item => item.name.toLowerCase().includes(orderSearchTerm.toLowerCase()))
      return matchesStatus && matchesDateRange && matchesSearch
    })
  }

  const getAverageRating = (comments: ItemComment[]) => {
    if (comments.length === 0) return 0
    const sum = comments.reduce((acc, comment) => acc + comment.rating, 0)
    return (sum / comments.length).toFixed(1)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vendor Management System</h1>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {filteredVendors.map((vendor) => (
        <Card key={vendor.id} className="mb-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold">{vendor.name}</CardTitle>
              <Badge variant={vendor.status === 'active' ? 'default' : vendor.status === 'inactive' ? 'secondary' : 'outline'}>
                {vendor.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="flex items-center"><Mail className="w-4 h-4 mr-2" /> {vendor.email}</p>
                <p className="flex items-center"><Phone className="w-4 h-4 mr-2" /> {vendor.phone}</p>
              </div>
              <div>
                <p>Last Order: {vendor.lastOrderDate}</p>
                <p>Total Orders: {vendor.totalOrders}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => toggleVendorExpansion(vendor.id)} className="w-full justify-between">
              {expandedVendor === vendor.id ? 'Hide Details' : 'Show Details'}
              {expandedVendor === vendor.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            {expandedVendor === vendor.id && (
              <div className="mt-4">
                <Tabs defaultValue="orders" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="shop">Shop Items</TabsTrigger>
                  </TabsList>
                  <TabsContent value="orders">
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline">Select Date Range</Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={dateRange.from}
                              selected={dateRange}
                              onSelect={()=>setDateRange}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                        <Input
                          type="text"
                          placeholder="Search orders..."
                          value={orderSearchTerm}
                          onChange={(e) => setOrderSearchTerm(e.target.value)}
                          className="w-[200px]"
                        />
                      </div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      {filterOrders(vendor.orders).map((order) => (
                        <AccordionItem value={order.id} key={order.id}>
                          <AccordionTrigger>
                            <div className="flex justify-between items-center w-full">
                              <span>Order ID: {order.id}</span>
                              {getStatusBadge(order.status)}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p><strong>Customer:</strong> {order.customerName} (ID: {order.customerId})</p>
                                  <p><strong>Date:</strong> {order.date}</p>
                                </div>
                                <div className="text-right">
                                  {getPaymentStatusBadge(order.paymentStatus)}
                                  <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                </div>
                              </div>
                              <div>
                                <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                                <p><strong>Shipping Method:</strong> {order.shippingMethod}</p>
                                <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
                                <p><strong>Estimated Delivery:</strong> {order.estimatedDeliveryDate}</p>
                              </div>
                              <div className="bg-muted p-2 rounded-md">
                                <h4 className="font-semibold mb-2">Order Status Timeline</h4>
                                <div className="flex justify-between items-center">
                                  <Badge variant={order.status === 'processing' ? 'default' : 'outline'}>Processing</Badge>
                                  <ChevronRight className="w-4 h-4" />
                                  <Badge variant={order.status === 'shipped' ? 'default' : 'outline'}>Shipped</Badge>
                                  <ChevronRight className="w-4 h-4" />
                                  <Badge variant={order.status === 'delivered' ? 'default' : 'outline'}>Delivered</Badge>
                                </div>
                              </div>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Total</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.items.map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>{item.name}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>${item.price.toFixed(2)}</TableCell>
                                      <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                              <div className="flex justify-between items-center">
                                <p className="font-bold text-lg">
                                  Total: ${order.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
                                </p>
                                <Button variant="outline">
                                  <Download className="w-4 h-4 mr-2" />
                                  Download Invoice
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>
                  <TabsContent value="shop">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Avg. Rating</TableHead>
                          <TableHead>Comments</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vendor.shopItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>${item.price.toFixed(2)}</TableCell>
                            <TableCell>{item.stock}</TableCell>
                            <TableCell>{getAverageRating(item.comments)}</TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MessageSquare className="h-4 w-4" />
                                      <span className="sr-only">View comments</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <ul className="list-disc pl-4">
                                      {item.comments.map((comment) => (
                                        <li key={comment.id}>
                                          {comment.text} (Rating: {comment.rating}/5)
                                        </li>
                                      ))}
                                    </ul>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>

                <div className="flex items-center gap-2 mt-4">
                  <label htmlFor={`status-${vendor.id}`} className="font-semibold">Update Status:</label>
                  <Select
                    value={vendor.status}
                    onValueChange={(value: 'active' | 'inactive' | 'pending') => updateVendorStatus(vendor.id, value)}
                  >
                    <SelectTrigger id={`status-${vendor.id}`}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}