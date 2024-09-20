import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavigationMenus } from "./NavLink";
import { LOGOUT } from "../route/forms/gql/mutation";
import { useAuth } from "@/middleware/context/authContext";
import { useMutation } from "@apollo/client";

export function MainNav() {
  const { logout } = useAuth(); // Access the logout function from the auth context
  const [logoutMutation] = useMutation(LOGOUT); // Apollo useMutation hook

  const handleLogout = async () => {
    try {
      // Call the GraphQL logout mutation
      await logoutMutation();

   

      // Perform the local logout (clear localStorage and update state)
      logout();

      // Optionally, you can display a message or redirect elsewhere
      console.log("Logout successful");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };
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
        <Link
          className={cn("transition-colors hover:text-foreground/80")}
          
          onClick={handleLogout}
        >
          LogOut
        </Link>
      </nav>
    </div>
  );
}
