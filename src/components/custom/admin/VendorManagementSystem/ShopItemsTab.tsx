import { Vendor } from "./helper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ShopItemsTabProps = {
  vendor: Vendor;
};

export default function ShopItemsTab({ vendor }: ShopItemsTabProps) {
  //  console.log("shopItems",vendor.shopItems);
    
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Quantity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vendor?.shopItems?.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>GH¢ {item.price}</TableCell>
            <TableCell>{item.stock || "unknown"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
