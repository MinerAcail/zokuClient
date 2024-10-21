import { useState } from "react";
import { Bell, Calendar, Clock, MapPin, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import LocationSelector from "../../admin/payment/ui/map";

export default function UserFinalCart() {
  const [progress, setProgress] = useState(66);

  return (
    <div className="mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl"> Track Delivery</CardTitle>
          <CardDescription>
            Track your package and manage delivery options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="status" className="w-full">
            <TabsList className="grid  w-full grid-cols-3">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
            </TabsList>
            <TabsContent value="status">
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Order #12345</span>
                  <span className="text-sm text-muted-foreground">
                    Estimated delivery: June 15, 2023
                  </span>
                </div>
                <Progress value={progress} className="w-full" />
                <div className="flex justify-between text-sm">
                  <span>Ordered</span>
                  <span>Shipped</span>
                  <span>Delivered</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="text-sm">
                      Your package is out for delivery
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Last location: Distribution Center, Springfield
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details">
              <div className="mt-4 space-y-4">
                {/* responsive grid */}
                <div className="grid  text-white text-lg grid-cols-1 md:grid-cols-2  gap-4">
                  <DeluxeRating />
                  
                  <CheckboxMultiple />

                </div>
              </div>
            </TabsContent>
            <TabsContent value="options">
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="delivery-option"
                    className="text-sm font-medium"
                  >
                    Delivery Preference
                  </label>
                  <Select>
                    <SelectTrigger id="delivery-option">
                      <SelectValue placeholder="Select delivery option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        Standard Delivery (by Zuko)
                      </SelectItem>
                      <SelectItem value="express">
                        Vender Delivery (at your own risk)
                      </SelectItem>
                      <SelectItem value="pickup">
                        Local Pickup (at your own risk)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Reschedule
                  </Button>
                  <LocationSelector Select="Change Location" />

                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link to="/cart">
            <Button variant="outline" size="sm">
              <Package className="mr-2 h-4 w-4" />
              View Order Details
            </Button>
          </Link>
         
        </CardFooter>
      </Card>
    </div>
  );
}




import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

//import { toast } from "@/components/hooks/use-toast"
//import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast";
const items = [
  {
    id: "1xWidgetPro",
    label: "1x Widget Pro",
  },
  //more items
  {
    id: "2xGadgetMini",
    label: "2x Gadget Mini",
  },    
  {
    id: "3xToolMax",
    label: "3x Tool Max",
  },
  {
    id: "4xDongleUltra",
    label: "4x Dongle Ultra",
  },
  {
    id: "5xCablePro",
    label: "5x Cable Pro",
  },
  {
    id: "6xMousePro",
    label: "6x Mouse Pro",
  }
  ,{
    id: "7xKeyboardPro",
    label: "7x Keyboard Pro",
  }

  
] as const

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

export function CheckboxMultiple() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["recents", "home"],
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl shadow-lg ">

    <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 flex flex-col items-center justify-center w-full  text-center"
    >
      <FormField
        control={form.control}
        name="items"
        render={() => (
          <FormItem className="w-full max-w-lg">
            <div className="mb-4">
              <FormLabel className="text-base">Items</FormLabel>
              <FormDescription>
                Select the items that have been delivered.
              </FormDescription>
            </div>
            <div className="flex flex-col items-center">
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row justify-between items-center w-3/6 px-3 py-1 space-x-3"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="w-2/4">
        Submit
      </Button>
    </form>
  </Form>
  </div>
  )
}













import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface RatingProps {
  initialRating?: number
  onChange?: (rating: number) => void
  readonly?: boolean
  label?: string
  description?: string
}
export function DeluxeRating({
  initialRating = 0,
  onChange,
  readonly = false,
  label = 'Rate your experience',
  description = 'Select the number of stars to rate'
}: RatingProps = {}) {
  const [rating, setRating] = useState(initialRating)
  const [hover, setHover] = useState(0)

  const handleClick = (value: number) => {
    if (!readonly) {
      setRating(value)
      onChange?.(value)
    }
  }

  return (
    <div className="p-6 h-fit text-white bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl shadow-lg max-w-sm mx-auto">
      {label && (
        <h2 className="text-2xl font-bold mb-2 text-white">{label}</h2>
      )}
      {description && (
        <p className="text-sm text-gray-300 mb-4">{description}</p>
      )}
      <div className="flex items-center justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star
              className={`w-10 h-10 cursor-pointer transition-all duration-300 ${
                star <= (hover || rating)
                  ? 'text-yellow-300 fill-yellow-300 filter drop-shadow-lg'
                  : 'text-gray-500'
              } ${readonly ? 'cursor-default' : ''}`}
              onClick={() => handleClick(star)}
              onMouseEnter={() => !readonly && setHover(star)}
              onMouseLeave={() => !readonly && setHover(0)}
            />
          </motion.div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <motion.span
          className="text-lg font-semibold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={rating}
        >
          {rating > 0 ? `${rating} out of 5` : 'No rating yet'}
        </motion.span>
      </div>
    </div>
  )
}
