import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react"; // Assuming you are using lucide-react icons

interface SearchProps {
  onSearch: (query: string) => void;
}

export function Search({ onSearch }: SearchProps) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className="relative my-2">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 ">
        <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </span>
      <Input
        type="search"
        placeholder="Search..."
        className="md:w-[100px] lg:w-[300px] py-2 pl-10 pr-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-200 ease-in-out"
        
        onChange={handleInputChange}
      />
    </div>
  );
}
