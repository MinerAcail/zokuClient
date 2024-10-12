import { useState } from 'react'
import { Bell, Calendar, Clock, MapPin, MessageSquare, Phone, Shield, Truck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function Driver() {
  const [deliveryProgress, setDeliveryProgress] = useState(40)

  return (
    <div className="mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Driver Dashboard</CardTitle>
              <CardDescription>Manage your deliveries and routes</CardDescription>
            </div>
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="Driver" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="current">Current Delivery</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
            </TabsList>
            <TabsContent value="current">
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Order #67890</span>
                  <Badge variant="outline">In Progress</Badge>
                </div>
                <Progress value={deliveryProgress} className="w-full" />
                <div className="flex justify-between text-sm">
                  <span>Picked Up</span>
                  <span>In Transit</span>
                  <span>Delivered</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="text-sm">Destination: 456 Elm St, Springfield</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Estimated arrival: 2:30 PM</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Phone className="mr-2 h-4 w-4" />
                    Contact Customer
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Report Issue
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="schedule">
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Today's Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center">
                          <span>9:00 AM - Order #67890</span>
                          <Badge>In Progress</Badge>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>11:30 AM - Order #67891</span>
                          <Badge variant="outline">Pending</Badge>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>2:00 PM - Order #67892</span>
                          <Badge variant="outline">Pending</Badge>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tomorrow's Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center">
                          <span>8:30 AM - Order #67893</span>
                          <Badge variant="outline">Scheduled</Badge>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>10:00 AM - Order #67894</span>
                          <Badge variant="outline">Scheduled</Badge>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>1:30 PM - Order #67895</span>
                          <Badge variant="outline">Scheduled</Badge>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="navigation">
              <div className="mt-4 space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Map View</span>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Truck className="mr-2 h-4 w-4" />
                    Start Navigation
                  </Button>
                  <Button variant="outline" size="sm">
                    <MapPin className="mr-2 h-4 w-4" />
                    View Route Details
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="safety">
              <div className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Safety Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-green-500" />
                        <span>Vehicle inspection completed</span>
                      </li>
                      <li className="flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-green-500" />
                        <span>Safety gear on board</span>
                      </li>
                      <li className="flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-green-500" />
                        <span>First-aid kit checked</span>
                      </li>
                      <li className="flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>Weather conditions reviewed</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Button variant="outline" size="sm">
                  <Bell className="mr-2 h-4 w-4" />
                  Report Safety Concern
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            View Full Schedule
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Dispatch
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}