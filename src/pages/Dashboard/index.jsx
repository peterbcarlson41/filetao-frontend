import React, { useEffect, useState, useCallback } from "react";
import FileDashboardNav from "@/pages/Dashboard/components/FileDashboardNav";
import VerticalNavbar from "@/components/common/VerticalNavbar";
import FileTableItem from "@/pages/Dashboard/components/FileTableItem";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { formatBytes } from "@/utils/formatBytes";
import { formatDate } from "@/utils/formatDate";
import LoadingPopup from "@/components/common/LoadingPopup";
import { ScrollArea } from "@/components/ui/scroll-area";

const FilesDashboard = () => {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isLoading, setIsLoading] = useState({ active: false, message: "" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleLoading = ({ active, message = "" }) => {
    setIsLoading({ active, message });
  };

  return (
    <div className="flex flex-row h-screen">
      <VerticalNavbar isMenuOpen={isMenuOpen} />
      <div className="sm:px-10 px-2 flex flex-col pb-5 flex-1 overflow-hidden">
        {isLoading.active && <LoadingPopup message={isLoading.message} />}
        <FileDashboardNav
          handleFileChange={handleFileChange}
          handleSearchChange={handleSearchChange}
          setSortBy={setSortBy}
          toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        />
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
                  toggleLoading={toggleLoading}
                  isLoading={isLoading}
                />
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default FilesDashboard;
