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
              <Route path="/favourite" element={<AddedFavourite />} />
              <Route path="/addedshop" element={<AllAddedShop />} />

              <Route path="/form" element={<VendorForm />} />
              <Route path="/createuser" element={<UserForm />} />
              <Route path="/createswapper" element={<SideSwapperForm />} />

              <Route path="/login" element={<LoginForm />} />

              <Route path="/uploader" element={<FileUploader />} />
              <Route path="/vendorupload" element={<VendorFileUploader />} />
              <Route path="/chart" element={<Chart />} />

              <Route path="/market" element={<Market />} />
              <Route path="/cart" element={<CartProduct />} />
              <Route path="/swapper" element={<SwapperShop />} />
              <Route path="/advertisement" element={<AppTemplate />} />
              <Route path="/upload" element={<AdvertisementUpload />} />
              
            </Route>
          </Routes>
        </ThemeProvider>
        </AuthProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
}
//<Route path="/market" element={<ProtectedRoute expectedTypes={['vendor']} element={<Market />} />} />
// 
export default Navigation;
