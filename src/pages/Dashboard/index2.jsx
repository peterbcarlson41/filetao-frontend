import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { CircleUser, Menu, Search } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Tao from "@/components/common/Tao";
import FileTableItem from "@/pages/Dashboard/components/FileTableItem";
import FileDashboardNav from "@/pages/Dashboard/components/FileDashboardNav";
import StatisticsCard from "@/components/common/StatisticsCard";
import UploadPopup from "@/components/common/UploadPopup";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { formatBytes } from "@/utils/formatBytes";
import { formatDate } from "@/utils/formatDate";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isUploading, setIsUploading] = useState([]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  const { logout } = useAuth();
  let navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles, sortBy]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

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
    // Reset the popup state to ensure it can trigger a re-render
    setShowUploadPopup(false);
    setTimeout(() => setShowUploadPopup(true), 0);

    const selectedFiles = Array.from(formData.getAll("files"));
    const fileUploadStates = selectedFiles.map((file) => ({
      filename: file.name.split(".").slice(0, -1).join("."),
      extension: file.name.split(".").pop(),
      loading: true, // Set loading to true as the upload starts
      status: "uploading", // Initial upload status
      action: "upload",
    }));

    setIsUploading(fileUploadStates);

    const accessToken = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:8000/uploadfiles", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const updatedFileUploadStates = fileUploadStates.map((file) => ({
        ...file,
        loading: false,
        status: response.ok ? "success" : "failed",
      }));

      setIsUploading(updatedFileUploadStates);
      if (!response.ok)
        throw new Error(`Upload failed: ${response.statusText}`);
      alert("Files uploaded successfully.");
      fetchFiles();
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error.message || "Upload failed.");
      setIsUploading(
        fileUploadStates.map((file) => ({
          ...file,
          loading: false,
          status: "failed",
        }))
      );
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

    event.target.value = "";
  };

  const handleClosePopup = () => {
    setShowUploadPopup(false);
    setIsUploading([]);
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      {showUploadPopup && (
        <UploadPopup files={isUploading} onClose={handleClosePopup} />
      )}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full justify-between max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <Tao className="h-6 w-6" />
              <span className="">FileTao</span>
            </a>
          </div>
          <div className="p-4">
            <Card x-chunk="dashboard-02-chunk-0">
              <StatisticsCard />
            </Card>
          </div>
          <footer className="p-5">
            <a
              href="https://github.com/ifrit98/storage-subnet/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="h-6 w-6" />
            </a>
          </footer>
        </div>
      </div>
      <div className="flex flex-col h-screen">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <a
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Tao className="h-6 w-6" />
                  <span className="sr-only">FileTao</span>
                </a>
              </nav>
              <div className="">
                <Card>
                  <StatisticsCard />
                </Card>
              </div>
              <footer>
                <a
                  href="https://github.com/ifrit98/storage-subnet/blob/main/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="h-6 w-6" />
                </a>
              </footer>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search files..."
                  onChange={handleSearchChange}
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <FileDashboardNav
          handleFileChange={handleFileChange}
          setSortBy={setSortBy}
        ></FileDashboardNav>
        <main className="flex flex-1 flex-col gap-4 px-4 pb-4 overflow-hidden">
          <ScrollArea className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:table-cell"></TableHead>
                  <TableHead className="">Name</TableHead>
                  <TableHead className="hidden md:table-cell">Size</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Last Modified
                  </TableHead>
                  <TableHead className=""></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedFiles.map((file) => (
                  <FileTableItem
                    key={file.id}
                    filename={file.filename}
                    size={formatBytes(file.size).string}
                    uploaded={formatDate(file.uploaded)}
                    extension={file.ext}
                  />
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
