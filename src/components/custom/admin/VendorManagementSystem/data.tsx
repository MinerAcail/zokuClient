import { Vendor } from "./helper";


export const initialVendors: Vendor[] = [
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
          date: "2024-09-03",
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
        },{
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
        },
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
        },
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
        },
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
    {
      id: 3,
      name: "Initech",
      email: "support@initech.com",
      phone: "321-654-0987",
      status: 'active',
      orders: [
        {
          id: "ORD004",
          customerId: "CUST004",
          customerName: "Michael Scott",
          date: "2023-09-25",
          deliveryAddress: "123 Scranton Ave, Scranton, PA 18503",
          status: 'delivered',
          items: [
            { id: 6, name: "Product X", quantity: 30, price: 9.99 },
          ],
          paymentStatus: 'paid',
          paymentMethod: 'Credit Card',
          shippingMethod: 'Express',
          trackingNumber: 'TRACK654321',
          estimatedDeliveryDate: '2023-09-30',
        }
      ],
      shopItems: [
        { id: 6, name: "Product X", price: 9.99, stock: 200, comments: [
          { id: 10, text: "Affordable and reliable", rating: 5 },
          { id: 11, text: "Fast delivery", rating: 4 }
        ] },
        { id: 7, name: "Service Y", price: 29.99, stock: 50, comments: [
          { id: 12, text: "Excellent service", rating: 5 },
        ] },
      ],
      lastOrderDate: "2023-09-25",
      totalOrders: 1,
    },
    {
      id: 4,
      name: "Tech Co",
      email: "info@techco.com",
      phone: "456-789-0123",
      status: 'active',
      orders: [
        {
          id: "ORD005",
          customerId: "CUST005",
          customerName: "Dwight Schrute",
          date: "2023-09-26",
          deliveryAddress: "456 Beet Farm Rd, Scranton, PA 18503",
          status: 'processing',
          items: [
            { id: 8, name: "Gadget Z", quantity: 20, price: 49.99 },
          ],
          paymentStatus: 'unpaid',
          paymentMethod: 'Credit Card',
          shippingMethod: 'Standard',
          trackingNumber: 'Not Available',
          estimatedDeliveryDate: '2023-10-05',
        },
        {
          id: "ORD006",
          customerId: "CUST006",
          customerName: "Pam Beesly",
          date: "2023-09-27",
          deliveryAddress: "789 Artist Alley, Scranton, PA 18503",
          status: 'shipped',
          items: [
            { id: 9, name: "Widget W", quantity: 10, price: 15.99 },
          ],
          paymentStatus: 'paid',
          paymentMethod: 'PayPal',
          shippingMethod: 'Express',
          trackingNumber: 'TRACK321654',
          estimatedDeliveryDate: '2023-10-02',
        }
      ],
      shopItems: [
        { id: 8, name: "Gadget Z", price: 49.99, stock: 150, comments: [] },
        { id: 9, name: "Widget W", price: 15.99, stock: 80, comments: [
          { id: 13, text: "Very useful product", rating: 5 }
        ] },
      ],
      lastOrderDate: "2023-09-27",
      totalOrders: 2,
    },
    {
      id: 5,
      name: "Umbrella Corp",
      email: "info@umbrella.com",
      phone: "987-654-3210",
      status: 'active',
      orders: [
        {
          id: "ORD007",
          customerId: "CUST007",
          customerName: "Chris Redfield",
          date: "2023-09-28",
          deliveryAddress: "4 Raccoon City, Raccoon, CA 12345",
          status: 'delivered',
          items: [
            { id: 10, name: "Survival Kit", quantity: 5, price: 99.99 },
          ],
          paymentStatus: 'paid',
          paymentMethod: 'Bank Transfer',
          shippingMethod: 'Express',
          trackingNumber: 'TRACK987654',
          estimatedDeliveryDate: '2023-10-01',
        }
      ],
      shopItems: [
        { id: 10, name: "Survival Kit", price: 99.99, stock: 30, comments: [
          { id: 14, text: "Life-saving kit!", rating: 5 }
        ] },
      ],
      lastOrderDate: "2023-09-28",
      totalOrders: 1,
    },
  ];
  