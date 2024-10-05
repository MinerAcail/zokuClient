

interface Vendor {
    name: string;
  }
  
  interface Product {
    name: string;
    Vendor: Vendor;
  }
  
  interface Item {
    id: string;
    quantity: number;
    product: Product;
  }
  
  interface Cart {
    id: string;
    userName: string;
    userId: string;
    items: Item[];
  }
  
  interface GroupedData {
    vendorName: string;
    users: {
      userName: string;
      items: {
        productName: string;
        quantity: number;
      }[];
    }[];
  }
  
  // Function to group cart data
 export const groupCartData = (carts: Cart[]): GroupedData[] => {
    const groupedData: GroupedData[] = [];
  
    carts.forEach((cart) => {
      cart.items.forEach((item) => {
        const vendorName = item.product.Vendor.name;
        const productName = item.product.name;
  
        // Find the vendor in the grouped data
        let vendorGroup = groupedData.find((vendor) => vendor.vendorName === vendorName);
        
        if (!vendorGroup) {
          // If vendor does not exist, create a new group
          vendorGroup = { vendorName, users: [] };
          groupedData.push(vendorGroup);
        }
  
        // Find the user in the vendor's group
        let userGroup = vendorGroup.users.find((user) => user.userName === cart.userName);
        
        if (!userGroup) {
          // If user does not exist, create a new user group
          userGroup = { userName: cart.userName, items: [] };
          vendorGroup.users.push(userGroup);
        }
  
        // Add the item to the user's list
        userGroup.items.push({
          productName,
          quantity: item.quantity,
        });
      });
    });
  
    return groupedData;
  };
  