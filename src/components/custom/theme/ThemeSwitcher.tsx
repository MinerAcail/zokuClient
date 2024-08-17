import React from "react";
import { useTheme } from "./context/themeContext"; // Adjust the import path based on your project structure
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeOptions } from "./utils/themeUtils";




const ThemeSwitcher = () => {
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {theme ? theme.charAt(0).toUpperCase() + theme.slice(1) : "Select theme..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search theme..." />
          <CommandList>
            <CommandEmpty>No theme found.</CommandEmpty>
            <CommandGroup>
              {ThemeOptions.map((themeOption) => (
                <CommandItem
                  key={themeOption}
                  value={themeOption}
                  onSelect={() => {
                    setTheme(themeOption); // Now correctly typed as ThemeName
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      theme === themeOption ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeSwitcher;
