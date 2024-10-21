import { Badge } from "@/components/ui/badge"



export const getStatusBadge = (status: 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
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

  export const getPaymentStatusBadge = (status: 'paid' | 'unpaid') => {
    return status === 'paid' ? 
      <Badge variant="default">Paid</Badge> : 
      <Badge variant="destructive">Unpaid</Badge>
  }


  export   const getAverageRating = (comments: ItemComment[]) => {
    if (comments.length === 0) return 0
    const sum = comments.reduce((acc, comment) => acc + comment.rating, 0)
    return (sum / comments.length).toFixed(1)
  }

  export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price:  number;
  }
  
  export interface Order {
    id: string;
    customerId: string;
    customerName: string;
    date: string;
    deliveryAddress: string;
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: OrderItem[];
    paymentStatus: 'paid' | 'unpaid';
    paymentMethod: string;
    shippingMethod: string;
    trackingNumber: string;
    estimatedDeliveryDate: string;
  }
  
  export interface ItemComment {
    id: number;
    text: string;
    rating: number;
  }
  
  export interface Item {
    id: string;
    name: string;
    price:  number;
    stock: string | number;
    quantity: string | number;
    comments: ItemComment[];
  }
  
  export interface Vendor {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'pending';
    orders: Order[];
    shopItems: Item[];
    lastOrderDate: string;
    totalOrders: number;
  }
  
  // Product type for each product under Vendor
  interface Product {
    id: string;
    name: string;
    stock: string | number;
    price:  number; // Assuming it's a string since you are converting it to a number later
  }
  
  // Vendor type for each product's vendor
  interface VendorDetails {
    id: string;
    name: string;
    number: string;
    product: Product[]; // Vendor has an array of products
  }
  
  // ProductItem type for each item in the cart
  interface ProductItem {
    id: string;
    quantity: string; // Assuming it's a string since you're converting it to a number
    product: {
      name: string;
      price:  number;
      Vendor: VendorDetails; // Vendor details inside each product
    };
  }
  
  // Cart type representing each cart
  interface Cart {
    id: string;
    userName: string;
    UserNumber: string;
    userId: string;
    items: ProductItem[]; // Each cart has an array of items
  }
  
  // Root type for the response structure
  interface AllCartResponse {
    allCart: Cart[]; // Array of carts
  }
  export const ghSim = "GH¢"
  export function transformData(data: AllCartResponse): Vendor[] {
    const vendorsMap: { [key: string]: Vendor } = {};
  
    data?.allCart?.forEach((cart: Cart) => {
      cart.items.forEach((item: ProductItem) => {
        const vendorId = item.product.Vendor.id; // Get vendor ID from the item
  
        if (!vendorsMap[vendorId]) {
          vendorsMap[vendorId] = {
            id: vendorId,
            name: item.product.Vendor.name,
            email: '', // Placeholder; adjust if email data is available
            phone: item.product.Vendor.number,
            status: 'active', // Placeholder; adjust based on business logic
            orders: [],
            shopItems: [],
            lastOrderDate: '', // Placeholder; adjust if last order date is available
            totalOrders: 0,
          };
        }
  console.log("item.product.Vendor",item.product.Vendor);
  
        // Add Vendor's products to the shopItems array if not already added
        item?.product?.Vendor?.product?.forEach((vendorProduct: Product) => {
          const existingShopItem = vendorsMap[vendorId].shopItems.find(
            (shopItem) => shopItem.id === vendorProduct.id
          );
          if (!existingShopItem) {

            vendorsMap[vendorId].shopItems.push({
              id: vendorProduct.id,
              name: vendorProduct.name,
              price: vendorProduct.price,
              stock: vendorProduct.stock, // Placeholder; adjust if stock data is available
              comments: [] // Placeholder for comments
            });
          }
        });
  
        // Create Order (if not already created for this cart)
        const existingOrder = vendorsMap[vendorId].orders.find(
          (order) => order.id === cart.id
        );
        if (!existingOrder) {
          const order: Order = {
            id: cart.id,
            customerId: cart.userId,
            customerName: cart.userName,
            date: new Date().toISOString(), // Set current date
            deliveryAddress: '', // Placeholder; adjust if address data is available
            status: 'processing', // Placeholder; adjust based on business logic
            items: [], // Initialize as empty
            paymentStatus: 'unpaid', // Placeholder; adjust as necessary
            paymentMethod: '', // Placeholder; adjust if payment method data is available
            shippingMethod: '', // Placeholder; adjust if shipping method data is available
            trackingNumber: '', // Placeholder; adjust if tracking number data is available
            estimatedDeliveryDate: '', // Placeholder; adjust if delivery date data is available
          };
          vendorsMap[vendorId].orders.push(order);
          vendorsMap[vendorId].totalOrders += 1; // Increment total orders
          vendorsMap[vendorId].lastOrderDate = order.date; // Update last order date
        }
  
        // Add items to the respective order
        const orderIndex = vendorsMap[vendorId].orders.findIndex(
          (order) => order.id === cart.id
        );
        const price = parseFloat(item?.product?.price); // Convert price to number
         
        const quantity = parseInt(item.quantity, 10); // Convert quantity to number
  
        if (orderIndex !== -1) {
          vendorsMap[vendorId].orders[orderIndex].items.push({
            id: item.id, // Ensure it's a number
            name: item.product.name,
            quantity: quantity,
            price: price,
          });
        }
      });
    });
  
    return Object.values(vendorsMap); // Convert map to array
  }
  

  //todoif the pricing type which to take string or number