import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import useFetchFiles from "@/hooks/useFetchFiles";
import useFileUpload from "@/hooks/useFileUpload";
import useFileDownload from "@/hooks/useFileDownload";
import useFileDelete from "@/hooks/useFileDelete";
import useFileSearchAndSort from "@/hooks/useFileSearchAndSort";
import {
  CircleUser,
  Menu,
  Search,
  MoreHorizontal,
  DownloadIcon,
  TrashIcon,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Tao from "@/components/common/Tao";
import FileDashboardNav from "@/pages/Dashboard/components/FileDashboardNav";
import StatisticsCard from "@/components/common/StatisticsCard";
import UploadDownloadPopup from "./components/UploadDownloadPopup";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showPopup, setShowPopup] = useState(false);

  const { logout } = useAuth();
  let navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDownloadClick = async (filename, extension) => {
    setShowPopup(true);
    await handleFileDownload(filename, extension);
  };

  const handleDeleteClick = async (filename, extension) => {
    await handleFileDelete(filename, extension);
  };

  //Get all of the API calls from hooks
  const { files, fetchFiles, numberOfFiles, storageUsed } = useFetchFiles();
  // prettier-ignore
  const { transfers: uploadTransfers, handleFileUpload, setTransfers } = useFileUpload(fetchFiles);
  // prettier-ignore
  const { downloads: downloadTransfers, handleFileDownload } = useFileDownload();
  const handleFileDelete = useFileDelete(fetchFiles);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Combine uploads and downloads into a single state for the popup
  const allTransfers = [...uploadTransfers, ...downloadTransfers];

  const sortedFiles = useFileSearchAndSort(files, searchTerm, sortBy);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleFileChange = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      alert("Please select files to upload.");
      return;
    }
    setShowPopup(true);
    handleFileUpload(Array.from(event.target.files));
    event.target.value = "";
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setTransfers([]);
  };

  return (
    <>
      {showPopup && (
        <UploadDownloadPopup files={allTransfers} onClose={handleClosePopup} />
      )}
      <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
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
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
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
                    <TableRow>
                      <TableCell className="text-left hidden md:table-cell">
                        <Checkbox />
                      </TableCell>
                      <TableCell className="text-left table-cell font-medium">
                        {file.filename}
                      </TableCell>
                      <TableCell className="text-left hidden md:table-cell">
                        {formatBytes(file.size).string}
                      </TableCell>
                      <TableCell className="text-left hidden md:table-cell">
                        {formatDate(file.uploaded)}
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
                            <DropdownMenuItem
                              onClick={() =>
                                handleDownloadClick(file.filename, file.ext)
                              }
                            >
                              <DownloadIcon className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteClick(file.filename, file.ext)
                              }
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </main>
        </div>
      </div>
    </>
  );
}
