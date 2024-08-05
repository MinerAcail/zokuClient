import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootLayout from "./rootLayout";
import Home from "../pages/home";
import { ApolloProvider } from "@apollo/client";
import Client from "./auth/middlware";
import AddedShop from "../pages/AddedShops";
import AddedFavourite from "../pages/AddedFavourite";
import AllAddedShop from "../pages/AllAddedShops";
import Market from "../pages/Market";
import { VenderForm } from "./forms/vender";
import { FileUploader } from "../fileInput/file-uploader";
import { Chart } from "../chart";
import SwapperShop from "../pages/swapper";
import AppTemplate from "../pages/template";
import { LoginForm } from "./forms/login";
import { VendorFileUploader } from "../fileInput/vendor/Vendor-file-uploader";


function Navigation() {
  return (
    <BrowserRouter>
      <ApolloProvider client={Client}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route path="*" element={<h1>Wrong Path</h1>} />
            <Route path="/" index element={<Home />} />
            <Route path="/form" index element={<VenderForm />} />
            <Route path="/login" index element={<LoginForm />} />

            <Route path="/uploader" index element={<FileUploader />} />
            <Route path="/vendorupload" index element={<VendorFileUploader />} />
            <Route path="/chart" index element={<Chart />} />

            <Route path="/market" index element={<Market />} />
            <Route path="/shop" index element={<AddedShop />} />
            <Route path="/swapper" index element={<SwapperShop />} />         
            <Route path="/advertisement" index element={<AppTemplate />} />
            <Route path="/favourite" index element={<AddedFavourite />} />
            <Route path="/addedshop" index element={<AllAddedShop />} />

          </Route>
        </Routes>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default Navigation;
