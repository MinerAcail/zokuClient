import { Outlet } from "react-router-dom";
import { MainNav } from "../NavBars/main-nav";
import { Search } from "../NavBars/search";
import { MobileNav } from "../NavBars/mobile-nav";

export default function RootLayout() {
  return (
    <div style={{}} className="app-container">
      <div className="flex justify-between">
        <MainNav />
        <Search />
        <MobileNav />
      </div>
      <div className="main-container">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
