import React, { useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, ListFilter } from "lucide-react";

function FileDashboardNav({ handleFileChange, setSortBy }) {
  const fileInputRef = useRef(null);

  return (
    <div className="flex flex-row justify-between h-16 gap-2 items-center px-5">
      <Button
        onClick={() => document.getElementById("fileInput").click()}
        className="gap-1"
      >
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Upload File
        </span>
      </Button>
      <input
        id="fileInput"
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }} // Hide the input if it's visually not needed
        multiple // If you want to upload multiple files at once
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <ListFilter className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Sort
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setSortBy("name")}>
            Name
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setSortBy("date")}>
            Date
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setSortBy("size")}>
            Size
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default FileDashboardNav;
