import { useEffect, useState } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ghSim } from "../VendorManagementSystem/helper";
import { Search } from "../../NavBars/search";
import {
  gql,
  useQuery,
  useMutation,
  Reference,
  StoreObject,
} from "@apollo/client";
import { FormatTimeAgo } from "../../useAble/comments/commentComponent";
import Empty, {
  ErrorMessage,
  LoadingSpinner,
} from "../../useAble/LoadAndErrorStatus";
import { useAuth } from "@/middleware/context/authContext";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Product {
  id: string;
  name: string;
  imageUrls: string[];
  price: number;
  brand: string;
  title: string;
  updatedAt: string;
}

// Define your GraphQL queries
const GET_PRODUCTS_BY_VENDOR_ID = gql`
  query getAllProductByID($vendorid: String!) {
    getAllProductById(Vendorid: $vendorid) {
      id
      price
      name
      updatedAt
      brand
      state
      title
    }
  }
`;

// GraphQL mutation for deleting a product
const DELETE_PRODUCT = gql`
  mutation delectProductById($productId: String!) {
    delectProductById(id: $productId)
  }
`;

const ProductRow = ({
  product,
  onEdit,
}: {
  product: Product;
  onEdit: () => void;
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  const [deleteProductById] = useMutation(DELETE_PRODUCT, {
    update(cache) {
      cache.modify({
        fields: {
          getAllProductById(existingProducts = [], { readField }) {
            return existingProducts.filter(
              (productRef: Reference | StoreObject | undefined) =>
                readField("id", productRef) !== product.id
            );
          },
        },
      });
    },
    onCompleted: () => {
      setOpenDialog(false);
    },
    onError: (error) => {
      console.error("Deletion error:", error);
    },
  });

  const confirmDeleteProduct = async () => {
    console.log("Deleting product ID:", product.id);
    await deleteProductById({
      variables: {
        productId: product.id,
      },
    });
  };

  return (
    <TableRow key={product.id} className="items-center">
      <TableCell className="text-center align-middle">{product.name}</TableCell>
      <TableCell className="text-center align-middle">{`${ghSim} ${product.price}`}</TableCell>
      <TableCell className="text-center align-middle">
        {product.brand || "Unknown"}
      </TableCell>
      <TableCell className="text-center align-middle">
        {new Date(product.updatedAt).toLocaleDateString()} (
        {FormatTimeAgo(product.updatedAt)})
      </TableCell>
      <TableCell className="text-center align-middle">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                //setProductIdToDelete(product.id); // Set the ID when opening dialog
                setOpenDialog(true); // Open the dialog
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product?
            </AlertDialogDescription>
            <div className="flex justify-end">
              <AlertDialogCancel onClick={() => setOpenDialog(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteProduct}>
                Confirm
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
};
function PMProduct({ tabValue }: { tabValue: string }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_PRODUCTS_BY_VENDOR_ID, {
    variables: { vendorid: user?.id },
  });

  useEffect(() => {
    if (data) {
      setProducts(data.getAllProductById);
    }
  }, [data]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <TabsContent value={tabValue}>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search onSearch={handleSearch} />
        </div>
        <Button
          className="rounded-xl"
          variant="secondary"
          onClick={() => navigate(`/add-product`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {error && <ErrorMessage message="Error loading products" />}
      {loading && <LoadingSpinner />}
      {!loading && !error && products.length === 0 && (
        <Empty message="No products available yet. Please add some." />
      )}

      {!loading && products.length > 0 && (
        <Table className="mx-auto w-full text-center">
          <TableHeader>
            <TableRow className="items-center">
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Brand</TableHead>
              <TableHead className="text-center">Updated</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProducts.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onEdit={() => navigate(`/pmsedit/${product.id}`)}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </TabsContent>
  );
}

export default PMProduct;
