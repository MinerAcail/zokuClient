import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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
        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/favourite"}
        >
          Favourites
        </Link>
        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/addedshop"}
        >
          Added Shops
        </Link>
        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/swapper"}
        >
          Side Swapper
        </Link>

        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/advertisement"}
        >
          Advertisement
        </Link>
        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/upload"}
        >
          UpLoad
        </Link>
        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/uploader"}
        >
          UpLoader
        </Link>
        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/chart"}
        >
          Data
        </Link>


        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/form"}
        >
          Forms
        </Link>
        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/createuser"}
        >
          Create User
        </Link>
        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/login"}
        >
          Log In
        </Link>
        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/vendorupload"}
        >
          Vendor Upload
        </Link>
        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/shop"}
        >
          Vendor shop
        </Link>
        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={"/createswapper"}
        >
          create Swapper
        </Link>
      </nav>
    </div>
  );
}
