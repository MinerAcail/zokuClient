"use client";

import * as React from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
// import { Icons } from "@/components/icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  // navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Binary } from "lucide-react";

const componentsForFavorvites: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: "Items",
    href: "/favourite",
    description: "See all your favourite items",
  },
  {
    title: "Shops",
    href: "/addedshop",
    description: "See all your favourite Shops",
  },
];

const componentsForLogins: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: "Log In",
    href: "/login",
    description: "",
  },
  {
    title: "Log Out",
    href: "/logout",
    description: "",
  },
];

const componentsForcreation: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: "Create User",
    href: "/createuser",
    description: "",
  },
  {
    title: "Create Swapper",
    href: "/createswapper",
    description: "",
  },
  {
    title: "Create Vendor",
    href: "/form",
    description: "",
  },
];

const componentsForHistory: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: "Cart",
    href: "/cart",
    description: "",
  },
  {
    title: "Cart History",
    href: "/history",
    description: "",
  },
  {
    title: "Intverments Data",
    href: "/form",
    description: "",
  },
];

export function NavigationMenus() {
  
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Favourites</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {componentsForFavorvites.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  to={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
     
        <NavigationMenuItem>
          <NavigationMenuTrigger>Creates</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {componentsForcreation.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  to={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Cart System</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {componentsForHistory.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  to={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { to: string }
>(({ className, title, children, to, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={to}
          className={cn(
            "block select-none space-y-1 rounded-xl p-3 outline-none hover:bg-slate-400 ",
            className
          )}
          ref={ref}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
