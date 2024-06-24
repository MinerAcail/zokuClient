import { BrowserRouter, Route, Routes } from "react-router-dom";

import RootLayout from "./rootLayout";

function Navigation() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route path="*" element={<h1>Wrong Path</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Navigation;
