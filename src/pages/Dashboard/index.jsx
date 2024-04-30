import React, { useEffect, useState, useRef } from "react";
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
  PlusCircle,
  ListFilter,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Tao from "@/components/common/Tao";
import StatisticsCard from "@/components/common/StatisticsCard";
import UploadPopup from "./components/UploadPopup";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { LoadingSpinner } from "@/components/common/Spinner";

import { formatBytes } from "@/utils/formatBytes";
import { formatDate } from "@/utils/formatDate";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [downloadingFiles, setDownloadingFiles] = useState({});

  const fileInputRef = useRef(null);

  const { logout } = useAuth();
  let navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const statisticsURL = import.meta.env.VITE_STATISTICS_URL;

  const handleNetworkStatistics = () => {
    window.location.href = statisticsURL;
  };

  const handleDownloadClick = async (file) => {
    setDownloadingFiles((prev) => ({ ...prev, [file.id]: true }));
    const success = await handleFileDownload(file.filename, file.ext);
    setDownloadingFiles((prev) => ({ ...prev, [file.id]: false }));
    if (success) {
      setSelectedFiles((prev) => ({ ...prev, [file.id]: false }));
    }
  };

  const handleDeleteClick = async (file) => {
    setDeletingFiles((prev) => ({ ...prev, [file.id]: true }));
    await handleFileDelete(file.filename, file.ext);
    setDeletingFiles((prev) => ({ ...prev, [file.id]: false }));
  };

  //control row for delete
  const handleRowClassName = (fileId) => {
    return deletingFiles[fileId] ? "opacity-50 pointer-events-none" : "";
  };

  //Get all of the API calls from hooks
  const { files, fetchFiles, numberOfFiles, storageUsed, userCap } =
    useFetchFiles();
  // prettier-ignore
  const { transfers: uploadTransfers, handleFileUpload, setTransfers } = useFileUpload(fetchFiles);
  // prettier-ignore
  const { handleFileDownload } = useFileDownload();
  const handleFileDelete = useFileDelete(fetchFiles);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

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

  const handleSelectFile = (fileId, isSelected) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [fileId]: isSelected,
    }));
  };

  // Function to handle confirmation action in the alert dialog
  const handleConfirmDelete = async () => {
    // Filter out selected files
    const filesToDelete = sortedFiles.filter((file) => selectedFiles[file.id]);

    // Set all deletingFiles to true
    const deletingFilesUpdate = {};
    for (const file of filesToDelete) {
      deletingFilesUpdate[file.id] = true;
    }
    setDeletingFiles((prev) => ({ ...prev, ...deletingFilesUpdate }));

    // Call delete function for each selected file
    for (const file of filesToDelete) {
      await handleDeleteClick(file);
    }
    s;

    // Create a new object with all values set to false
    const newSelectedFiles = {};
    for (const fileId in selectedFiles) {
      newSelectedFiles[fileId] = false;
    }
    setSelectedFiles(newSelectedFiles);
  };

  // Function to handle cancellation action in the alert dialog
  const handleCancelDelete = () => {
    // Create a new object with all values set to false
    const newSelectedFiles = {};
    for (const fileId in selectedFiles) {
      newSelectedFiles[fileId] = false;
    }
    setSelectedFiles(newSelectedFiles);
  };

  // Function to handle bulk download
  const handleBulkDownload = () => {
    const filesToDownload = sortedFiles.filter(
      (file) => selectedFiles[file.id]
    );

    for (const file of filesToDownload) {
      handleDownloadClick(file);
      // Uncheck the checkbox of the downloaded file
      setSelectedFiles((prevSelectedFiles) => ({
        ...prevSelectedFiles,
        [file.id]: false,
      }));
    }
  };

  return (
    <>
      {showPopup && (
        <UploadPopup files={uploadTransfers} onClose={handleClosePopup} />
      )}
      <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full justify-between max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <a href="/" className="flex items-center gap-2 font-semibold">
                <Tao className="h-10 w-10" />
              </a>
            </div>
            <div className="p-4">
              <Card x-chunk="dashboard-02-chunk-0">
                <StatisticsCard
                  numberOfFiles={numberOfFiles}
                  storageUsed={storageUsed}
                  userCap={userCap}
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
                    <Tao className="h-10 w-10" />
                  </a>
                </nav>
                <div className="my-auto">
                  <Card>
                    <StatisticsCard
                      numberOfFiles={numberOfFiles}
                      storageUsed={storageUsed}
                      userCap={userCap}
                    />
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
                <DropdownMenuItem onClick={handleNetworkStatistics}>
                  Network Statistics
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <div className="flex flex-row justify-between h-16 gap-2 items-center px-5">
            <div className="flex flex-row gap-2 items-center">
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
              {Object.values(selectedFiles).some(Boolean) && (
                <div className="flex flex-row gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <TrashIcon className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the following files?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="space-y-2">
                        {sortedFiles
                          .filter((file) => selectedFiles[file.id]) // Filter files based on selectedFiles state
                          .map((file) => (
                            <p key={file.id}>
                              <span className="font-medium">
                                {file.filename}
                              </span>
                              .{file.ext}
                            </p>
                          ))}
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelDelete}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button variant="outline" size="sm">
                    <DownloadIcon
                      onClick={handleBulkDownload}
                      className="h-3.5 w-3.5"
                    />
                  </Button>
                </div>
              )}
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
          <main className="flex flex-1 flex-col gap-4 px-4 pb-4 overflow-hidden">
            <ScrollArea className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="table-cell"></TableHead>
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
                    <TableRow key={file.id}>
                      <TableCell className="text-left">
                        <Checkbox
                          checked={selectedFiles[file.id]}
                          onCheckedChange={(checked) =>
                            handleSelectFile(file.id, checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-left table-cell font-medium">
                        {file.filename}.{file.ext}
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
                              className="rounded-full w-8 h-8 disabled:opacity-100"
                              size="icon"
                              variant="ghost"
                              disabled={downloadingFiles[file.id]}
                            >
                              {downloadingFiles[file.id] ? (
                                <LoadingSpinner className="text-blue-700 h-6 w-6" />
                              ) : (
                                <MoreHorizontal className="h-6 w-6" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleDownloadClick(file)}
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
