import React, { useEffect, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { CircleUser, Menu, Search } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Tao from "@/components/common/Tao";
import FileTableItem from "@/pages/Dashboard/components/FileTableItem";
import FileDashboardNav from "@/pages/Dashboard/components/FileDashboardNav";
import StatisticsCard from "@/components/common/StatisticsCard";
import UploadDownloadPopup from "./components/UploadDownloadPopup";
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
  const [transfers, setTransfers] = useState([]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [numberOfFiles, setNumberOfFiles] = useState(0);
  const [storageUsed, setStorageUsed] = useState(0);

  //get base API URL from environment variables
  const BASE_URL = import.meta.env.VITE_APP_API_URL;

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

    const url = `${BASE_URL}/user_data`;

    const response = await fetch(url, {
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

      // Get info to display in the stats card
      setNumberOfFiles(data.stats.filecount);
      // Convert storage to GB assuming the value is in bytes
      setStorageUsed(data.stats.storage);
    } else {
      console.error("Failed to fetch files");
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, []);

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

  const handleFileUpload = async (selectedFiles) => {
    setShowUploadPopup(true);
    const fileUploadStates = selectedFiles.map((file) => {
      return {
        id: uuidv4(),
        filename: file.name.split(".").slice(0, -1).join("."),
        extension: file.name.split(".").pop(),
        loading: true,
        status: "uploading",
        action: "upload",
      };
    });

    // Append new file upload states to the existing transfers, ensuring that previous transfers are not removed
    setTransfers((prev) => [...prev, ...fileUploadStates]);

    selectedFiles.forEach((file) => {
      const formData = new FormData();
      formData.append("file", file);

      const matchingState = fileUploadStates.find(
        (f) =>
          f.filename === file.name.split(".").slice(0, -1).join(".") &&
          f.extension === file.name.split(".").pop()
      );

      fetch(`${BASE_URL}/uploadfile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            setTransfers((prev) =>
              prev.map((trans) =>
                trans.id === matchingState.id
                  ? { ...trans, loading: false, status: "success" }
                  : trans
              )
            );
          } else {
            setTransfers((prev) =>
              prev.map((trans) =>
                trans.id === matchingState.id
                  ? { ...trans, loading: false, status: "failed" }
                  : trans
              )
            );
          }
        })
        .catch((error) => {
          setTransfers((prev) =>
            prev.map((trans) =>
              trans.id === matchingState.id
                ? { ...trans, loading: false, status: "failed" }
                : trans
            )
          );
        });
    });

    fetchFiles(); // Optionally, refresh files after all uploads complete, or consider a different approach to optimize user experience
  };

  const handleFileDownload = async (filename, extension) => {
    const newTransfer = {
      filename: filename,
      extension: extension,
      loading: true,
      status: "downloading",
      action: "download",
    };

    setTransfers((prevTransfers) => [...prevTransfers, newTransfer]);
    setShowUploadPopup(true);

    try {
      const token = localStorage.getItem("token");
      const url = `${BASE_URL}/retrieve/${encodeURIComponent(filename)}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${filename}.${extension}`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        // Update only the status and loading flag of the specific download
        setTransfers((prevTransfers) =>
          prevTransfers.map((file) =>
            file.filename === filename && file.extension === extension
              ? { ...file, loading: false, status: "success" }
              : file
          )
        );
      } else {
        throw new Error("Failed to download file");
      }
    } catch (error) {
      console.error("Download error:", error);
      setTransfers((prevTransfers) =>
        prevTransfers.map((file) =>
          file.filename === filename && file.extension === extension
            ? { ...file, loading: false, status: "failed" }
            : file
        )
      );
    }
  };

  const handleFileChange = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      alert("Please select files to upload.");
      return;
    }
    handleFileUpload(Array.from(event.target.files));
    event.target.value = ""; // Clear the input after handling files
  };

  const handleClosePopup = () => {
    setShowUploadPopup(false);
    setTransfers([]);
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      {showUploadPopup && (
        <UploadDownloadPopup files={transfers} onClose={handleClosePopup} />
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
              <StatisticsCard
                numberOfFiles={numberOfFiles}
                storageUsed={storageUsed}
              />
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
                  {/* <TableHead className="hidden md:table-cell"></TableHead> */}
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
                    onDownload={handleFileDownload} // Pass the download handler
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
