import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";

export default function FilesDashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col mt-16">
      <main className="flex-1 p-4 sm:px-6">
        <div className="flex items-start gap-4 flex-col">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-haspopup="true"
                  className="rounded-lg"
                  id="menu-button"
                  size="sm"
                  variant="outline"
                >
                  <ListIcon className="mr-2 h-4 w-4" />
                  All
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                aria-labelledby="menu-button"
                className="min-w-[200px]"
              >
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem checked>All</DropdownMenuItem>
                <DropdownMenuItem>Images</DropdownMenuItem>
                <DropdownMenuItem>Documents</DropdownMenuItem>
                <DropdownMenuItem>Videos</DropdownMenuItem>
                <DropdownMenuItem>Music</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="ml-auto flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-haspopup="true"
                    className="rounded-lg"
                    id="sort-button"
                    size="sm"
                    variant="outline"
                  >
                    <ChevronsDownIcon className="h-4 w-4" />
                    Newest
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  aria-labelledby="sort-button"
                  className="min-w-[200px]"
                >
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem checked>Newest</DropdownMenuItem>
                  <DropdownMenuItem>Oldest</DropdownMenuItem>
                  <DropdownMenuItem>Name</DropdownMenuItem>
                  <DropdownMenuItem>File size</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <form className="flex items-center gap-2 ml-auto">
                <SearchIcon className="h-4 w-4 text-muted-foreground" />
                <Input
                  className="w-[200px] sm:w-[300px] md:w-[400px] lg:w-[500px]"
                  placeholder="Search files..."
                  type="search"
                />
              </form>
            </div>
          </div>
          <div className="border-t border-gray-200 w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <span className="sr-only">Select</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Last modified
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <input className="w-1.5 h-1.5 rounded" type="checkbox" />
                  </TableCell>
                  <TableCell className="font-medium">
                    Q4 Financial Report
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    Spreadsheet
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    2 hours ago
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">1.2MB</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <input className="w-1.5 h-1.5 rounded" type="checkbox" />
                  </TableCell>
                  <TableCell className="font-medium">Budget Proposal</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    Document
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    1 day ago
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">4.5MB</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <input className="w-1.5 h-1.5 rounded" type="checkbox" />
                  </TableCell>
                  <TableCell className="font-medium">Project Plan</TableCell>
                  <TableCell className="hidden sm:table-cell">PDF</TableCell>
                  <TableCell className="hidden md:table-cell">
                    3 days ago
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">2.1MB</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <input className="w-1.5 h-1.5 rounded" type="checkbox" />
                  </TableCell>
                  <TableCell className="font-medium">
                    Customer Database
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    Database
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    1 week ago
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">5.0MB</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <input className="w-1.5 h-1.5 rounded" type="checkbox" />
                  </TableCell>
                  <TableCell className="font-medium">
                    User Interface Mockups
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">Image</TableCell>
                  <TableCell className="hidden md:table-cell">
                    2 weeks ago
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">3.3MB</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                Showing 1 to 5 of 5 entries
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ChevronsDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 6 5 5 5-5" />
      <path d="m7 13 5 5 5-5" />
    </svg>
  );
}

function FolderIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  );
}

function ListIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}

function Package2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
