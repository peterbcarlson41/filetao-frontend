import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, Search, ListFilter, Menu } from "lucide-react";

function FileDashboardNav({
  handleFileChange,
  handleSearchChange,
  setSortBy,
  toggleMenu,
}) {
  return (
    <div className="flex flex-row pl-10 sm:p-0 justify-between h-[64px] gap-2 items-center">
      <Button
        onClick={toggleMenu}
        variant="outline"
        size="sm"
        className="gap-1"
      >
        <Menu className="h-3.5 w-3.5" />
      </Button>
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
        style={{ display: "none" }}
        multiple
      />

      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          onChange={handleSearchChange}
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>

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
