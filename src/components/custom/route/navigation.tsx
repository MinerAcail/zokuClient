import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootLayout from "./rootLayout";
import Home from "../pages/home";
import { ApolloProvider } from "@apollo/client";
import Client from "./auth/middlware";
import AddedShop from "../pages/AddedShops";
import AddedFavourite from "../pages/AddedFavourite";
import AllAddedShop from "../pages/AllAddedShops";
import Market from "../pages/Market";
import { VendorForm } from "./forms/vender";
import { FileUploader } from "../fileInput/file-uploader";
import { Chart } from "../chart";
import SwapperShop from "../pages/swapper";
import AppTemplate from "../pages/template";
import { LoginForm } from "./forms/login";
import { VendorFileUploader } from "../fileInput/vendor/Vendor-file-uploader";
import { UserForm } from "./forms/createUser";
import { SideSwapperForm } from "./forms/createSideSwapper";

import AdvertisementUpload from "../pages/Adver";
import CartProduct from "../pages/cart";
import { ThemeProvider } from "../theme/context/themeContext";
import { AuthProvider } from "@/middleware/context/authContext";
import ProtectedRoute from "./protected";
import { ProtectType } from "@/middleware/useProtect";
import ProtectedIsAuthRoute from "./protectedIsAuth";
import EnhancedVendorManagement from "../admin/VendorManagementSystem";
import ProductManagement from "../admin/ProductManagement";
import { VendorFileUploaderEdit } from "../admin/ProductManagement/Vendor-file-uploader";
import Pay from "../pages/pay";
import UserFinalCart from "../pages/cart/user";
import Driver from "../pages/cart/driver";
//import VonderFinalCheckout from "../pages/cart/vonder";
import VenderFinalCheckout from "../pages/cart/vender";
//AuthProvider
function Navigation() {
              

  return (
    <BrowserRouter>
      <ApolloProvider client={Client}>
        <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route path="*" element={<h1>Wrong Path</h1>} />
              <Route path="/" index element={<Home />} />
              <Route path="/vendor/:vendorId" element={<AddedShop />} />

        

              <Route path="/addedshop" element={<ProtectedIsAuthRoute  element={<AllAddedShop />} />} />
              <Route path="/favourite" element={<ProtectedIsAuthRoute  element={<AddedFavourite />} />} />
              <Route path="/createuser" element={<ProtectedIsAuthRoute  element={<UserForm />} />} />
              <Route path="/form" element={<ProtectedIsAuthRoute  element={<VendorForm />} />} />
              <Route path="/createswapper" element={<ProtectedIsAuthRoute  element={<SideSwapperForm />} />} />
              <Route path="/cart" element={<ProtectedIsAuthRoute  element={<CartProduct />} />} />
              <Route path="/pay" element={<Pay  />} />
              <Route path="/userfinalcart" element={<UserFinalCart  />} />
              <Route path="/dms" element={<Driver  />} />
              <Route path="/vendercheckout" element={<VenderFinalCheckout  />} />
             
             
             



              <Route path="/login" element={<LoginForm />} />
              <Route path="/vms" element={<EnhancedVendorManagement />} />
              <Route path="/pms" element={<ProductManagement />} />
              
              
              <Route path="/pmsedit/:productId" element={<VendorFileUploaderEdit />} />
             


              <Route path="/uploader" element={<FileUploader />} />
              <Route path="/vendorupload" element={<VendorFileUploader />} />
              <Route path="/chart" element={<Chart />} />

              <Route path="/market" element={<Market />} />
      
              <Route path="/advertisement" element={<AppTemplate />} />
              <Route path="/upload" element={<AdvertisementUpload />} />
              
              <Route path="/swapper" element={<ProtectedRoute expectedTypes={[ProtectType.swapper]} element={<SwapperShop />} />} />
            </Route>
          </Routes>
        </ThemeProvider>
        </AuthProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default Navigation;
