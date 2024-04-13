import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, DownloadIcon, TrashIcon } from "lucide-react";

const FileTableItem = ({ filename, extension, uploaded, size, onDownload }) => {
  // Function to trigger download
  const handleDownloadClick = () => {
    onDownload(filename, extension); // Calling the passed download handler
  };

  return (
    <TableRow>
      <TableCell className="text-left hidden md:table-cell">
        <Checkbox />
      </TableCell>
      <TableCell className="text-left table-cell font-medium">
        {filename}
      </TableCell>
      <TableCell className="text-left hidden md:table-cell">{size}</TableCell>
      <TableCell className="text-left hidden md:table-cell">
        {uploaded}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="rounded-full w-8 h-8"
              size="icon"
              variant="ghost"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDownloadClick}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default FileTableItem;
