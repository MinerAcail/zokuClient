import { Outlet } from "react-router-dom";
import { MainNav } from "../NavBars/main-nav";
// import { Search } from "../NavBars/search";
import { MobileNav } from "../NavBars/mobile-nav";
import { Toaster } from '@/components/ui/sonner'
export default function RootLayout() {
  return (
    <div style={{}} className="app-container">
      <div className="flex justify-between stcky top-0 bckdrop-blur-md h-14">
        <MainNav />
        {/* <Search /> */}
        <MobileNav />
      </div>
      <div className="main-container">
        <main>
          <Outlet />

        <Toaster  position="bottom-center" />
        </main>
      </div>
    </div>
  );
}
