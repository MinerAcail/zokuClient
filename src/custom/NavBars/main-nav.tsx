// import { cn } from "@lib/utils"
import { Link } from "react-router-dom"
import { cn } from "../../lib/utils"
// import { cn } from "../../lib/utils"
// import { cn } from "../../lib/utils"
// import { cn } from "../../../lib/utils"

export function MainNav() {

  return (
    <div className="mr-4 hidden md:flex">
      <Link
        className="mr-6 flex items-center space-x-2" to={""}>
        {/* <Icons.logo className="h-6 w-6" /> */}
        <span className="hidden font-bold sm:inline-block">
          {"siteConfig.name"}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        <Link
          className={cn(
            "transition-colors hover:text-foreground/80"
          )} to={""}        >
          Docs
        </Link>
        <Link
          className={cn(
            "transition-colors hover:text-foreground/80"

          )} to={""}        >
          Components
        </Link>
        <Link
          className={cn(
            "transition-colors hover:text-foreground/80"
          )} to={""}        >
          Themes
        </Link>
        
        
      </nav>
    </div>
  )
}
