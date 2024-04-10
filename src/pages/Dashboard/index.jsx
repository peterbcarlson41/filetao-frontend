import React, { useEffect, useState, useCallback } from "react";
import { PlusCircle, Search, ListFilter } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import FileTableItem from "@/pages/Dashboard/components/FileTableItem";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatBytes } from "@/utils/formatBytes";
import { formatDate } from "@/utils/formatDate";
import LoadingPopup from "@/components/common/LoadingPopup";

const FilesDashboard = () => {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState({ active: false, message: "" });
  const itemsPerPage = 7;

  const fetchFiles = useCallback(async () => {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      console.error("No auth token found");
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/user_data", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const filesArray = Object.entries(data.file_metadata).map(
        ([key, value]) => {
          return { id: key, ...JSON.parse(value) };
        }
      );
      setFiles(filesArray);
    } else {
      console.error("Failed to fetch files");
    }
  }, []);

  // Use useEffect to call fetchFiles on component mount.
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles, sortBy]);

  // New function to update the search term state
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Function to sort files based on selected filter
  const sortFiles = (files, sortBy) => {
    switch (sortBy) {
      case "name":
        return [...files].sort((a, b) => a.filename.localeCompare(b.filename));
      case "size":
        return [...files].sort((a, b) => a.size - b.size);
      case "date":
        return [...files].sort(
          (a, b) => new Date(b.uploaded) - new Date(a.uploaded)
        );
      default:
        return files;
    }
  };

  const filteredFiles = files.filter((file) =>
    file.filename.toLowerCase().includes(searchTerm)
  );

  const sortedFiles = sortFiles(filteredFiles, sortBy);

  const handleFileUpload = async (formData) => {
    toggleLoading({ active: true, message: "Uploading" });
    const accessToken = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/uploadfiles", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      await response.json();
      alert("Files uploaded successfully.");
      fetchFiles(); // Refetch the files to update the table
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error.message || "Upload failed.");
    } finally {
      toggleLoading({ active: false, message: "" });
    }
  };

  const handleFileChange = async (event) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("files", file);
    });

    await handleFileUpload(formData);
  };

  // Calculate total pages
  const totalPages = Math.ceil(sortedFiles.length / itemsPerPage);

  // Slice files for the current page
  const currentFiles = sortedFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to change page
  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const toggleLoading = ({ active, message = "" }) => {
    setIsLoading({ active, message });
  };

  return (
    <div>
      <Navbar />
      <div className="px-10 pt-20">
        {isLoading.active && <LoadingPopup message={isLoading.message} />}
        <div className="flex flex-row justify-between items-center gap-5 pb-5">
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Size</TableHead>
                <TableHead className="hidden md:table-cell">
                  Last Modified Date
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentFiles.map((file) => (
                <FileTableItem
                  key={file.id}
                  filename={file.filename}
                  size={formatBytes(file.size).string}
                  uploaded={formatDate(file.uploaded)}
                  extension={file.ext}
                  toggleLoading={toggleLoading}
                />
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="py-5">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => changePage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {[...Array(totalPages).keys()].map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => changePage(pageNumber + 1)}
                    isActive={currentPage === pageNumber + 1}
                  >
                    {pageNumber + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    changePage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default FilesDashboard;
