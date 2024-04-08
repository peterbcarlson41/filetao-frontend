import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import FileTableItem from "@/components/common/FileTableItem";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { formatBytes } from "@/utils/formatBytes";
import { formatDate } from "@/utils/formatDate";

const FilesDashboard = () => {
  const [files, setFiles] = useState([]);

  // Define a function to fetch files. Using useCallback to memoize the function.
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
  }, [fetchFiles]);

  const handleFileUpload = async (formData) => {
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

  return (
    <div className="mt-20">
      <div className="flex flex-col p-10 items-start">
        <div className="pb-5">
          <Button
            onClick={() => document.getElementById("fileInput").click()}
            className="gap-1"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Upload File</span>
          </Button>
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            multiple
          />
        </div>
        <Table className="border">
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
            {files.map((file) => (
              <FileTableItem
                key={file.id}
                filename={file.filename}
                size={formatBytes(file.size)}
                uploaded={formatDate(file.uploaded)}
                extension={file.ext}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FilesDashboard;
