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
          to={""}
        >
          Market
        </Link>
        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={""}
        >
          Favourite Market
        </Link>
        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          to={""}
        >
          other things
        </Link>
      </nav>
    </div>
  );
}
