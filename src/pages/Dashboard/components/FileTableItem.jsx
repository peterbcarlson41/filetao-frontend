import React, { useState } from "react";
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
import LoadingPopup from "@/components/common/LoadingPopup";

const FileTableItem = ({
  filename,
  extension,
  uploaded,
  size,
  toggleLoading,
}) => {
  const onDownloadClick = () => handleDownload(filename, extension);

  const handleDownload = async (filename, extension) => {
    toggleLoading({ active: true, message: "Downloading" });
    const token = localStorage.getItem("token");
    const apiUrl = `http://127.0.0.1:8000/retrieve/${encodeURIComponent(
      filename
    )}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        // Append the extension to the filename for the download attribute
        a.download = `${filename}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        console.error("Failed to download the file.");
      }
    } catch (error) {
      console.error("An error occurred during the file download.", error);
    } finally {
      toggleLoading({ active: false, message: "" });
    }
  };

  return (
    <>
      <TableRow style={{ cursor: "pointer" }}>
        <TableCell className="text-left">
          <Checkbox />
        </TableCell>
        <TableCell className="text-left table-cell font-medium">
          {filename}
        </TableCell>
        <TableCell className="text-left hidden md:table-cell">{size}</TableCell>
        <TableCell className="text-left hidden lg:table-cell">
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
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onDownloadClick(filename, extension)}
              >
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
    </>
  );
};

export default FileTableItem;
