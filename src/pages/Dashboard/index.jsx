import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusCircle } from "lucide-react";

import FileTableItem from "@/components/common/FileTableItem";
import FileInput from "@/components/common/FileInput";

import React, { useEffect, useState } from "react";
import { formatBytes } from "@/utils/formatBytes";
import { formatDate } from "@/utils/formatDate";

const FilesDashboard = () => {
  const [files, setFiles] = useState([]);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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

        console.log(filesArray);

        setFiles(filesArray);
      } else {
        console.error("Failed to fetch files");
      }
    };

    fetchData();
  }, []);
  return (
    <div className="mt-20">
      <div className="flex flex-col p-10 items-start">
        <div className="pb-5">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Upload File</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4">
              <FileInput />
            </PopoverContent>
          </Popover>
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
