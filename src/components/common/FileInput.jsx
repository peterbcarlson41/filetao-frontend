import React, { useState } from "react";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/common/Spinner";
import { Error } from "@/components/common/Error";
import { Success } from "@/components/common/Success";

export default function FileInput() {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
    // Reset success and error messages on file selection
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!selectedFiles || selectedFiles.length === 0) {
      setErrorMessage("Please select files to upload.");
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("files", file);
    });

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

      const result = await response.json();
      console.log(result);
      setSuccessMessage("Files uploaded successfully.");
    } catch (error) {
      console.error("Upload failed:", error);
      setErrorMessage(error.message || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="max-w-sm w-full">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <div>File Upload</div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="space-y-2 relative">
                <Label htmlFor="file">Choose Files</Label>
                <div className="flex items-center relative">
                  <Input
                    id="file"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="pl-3 pr-10 py-2 w-full text-gray-500"
                  />
                  {isUploading && (
                    <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-3">
                      <LoadingSpinner className="h-5 w-5 text-blue-500" />
                    </div>
                  )}
                </div>
              </div>
              {errorMessage && <Error message={errorMessage} />}
              {successMessage && <Success message={successMessage} />}
              <Button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                disabled={isUploading}
              >
                Upload Files
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
