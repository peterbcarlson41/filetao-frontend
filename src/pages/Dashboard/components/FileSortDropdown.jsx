import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";

export const FileSortDropdown = ({ onSortChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <ListFilter className="h-3.5 w-3.5" />
          <span>Sort</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onSortChange("name")}>
          Name
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSortChange("date")}>
          Date
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSortChange("size")}>
          Size
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
