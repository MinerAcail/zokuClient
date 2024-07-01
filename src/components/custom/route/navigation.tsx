import { BrowserRouter, Route, Routes } from "react-router-dom";

import RootLayout from "./rootLayout";
import Home from "../pages/home";
function Navigation() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route path="*" element={<h1>Wrong Path</h1>} />
          <Route path="/" index element={<Home/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Navigation;
