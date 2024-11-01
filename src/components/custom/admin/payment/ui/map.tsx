import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Example ghana_regions data
import { ghana_regions } from "@/assets/mapdata/gh"

// Convert ghana_regions into an array of options
const regions = Object.entries(ghana_regions).flatMap(([region, towns]) =>
  towns.map((town) => ({
    value: town,
    label: `${town}, ${region}`, // or just town if you prefer
  }))
)

//todo add more locations
export default function LocationSelector({Select ="Select region...",itemsIds,onLocationSelector}:{
  Select?:string,itemsIds:string[],
  onLocationSelector?:(selection:string) =>void;
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
console.log("LocateFixedIcon",itemsIds);

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue)
    setOpen(false)
    onLocationSelector && onLocationSelector(currentValue)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-controls="region-list"
          className="w-[200px] justify-between"
        >
          {value || Select }
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search region..." />
          <CommandList id="region-list">
            <CommandEmpty>No region found.</CommandEmpty>
            <ScrollArea className="h-[200px]">
            <CommandGroup>
              {regions.map((region, index) => (
                <CommandItem
                  key={index}
                  value={region.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === region.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {region.label}
                </CommandItem>
              ))}
            </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}




