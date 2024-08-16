import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavigationMenus } from "./NavLink";

export function MainNav() {
  return (
    <div className="mr-4 hidden md:flex">
      <Link className="mr-6 flex items-center space-x-2" to={""}>
        {/* <Icons.logo className="h-6 w-6" /> */}
        <span className="hidden font-extrabold text-xl sm:inline-block">
          ZuKoS
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/market"}
        >
          Market
        </Link>

        <NavigationMenus />

        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/swapper"}
        >
          Side Swapper
        </Link>

        {/* <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/advertisement"}
        >
          Advertisement
        </Link> */}
        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/vendorupload"}
        >
          Upload Product
        </Link>
        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/chart"}
        >
          Data
        </Link>
      </nav>
    </div>
  );
}
