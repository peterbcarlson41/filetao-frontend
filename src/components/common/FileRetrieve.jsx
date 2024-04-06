import React, { useState } from "react";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/Spinner";
import { Error } from "@/components/common/Error";
import { Success } from "@/components/common/Success";

export default function Retrieve() {
  const [filename, setFilename] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRetrieveFile = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (!filename.trim()) {
      setErrorMessage("Filename cannot be empty.");
      return;
    }

    setIsLoading(true);
    const accessToken = localStorage.getItem("token");
    const apiUrl = `http://127.0.0.1:8000/retrieve/${encodeURIComponent(
      filename
    )}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setSuccessMessage("File retrieved successfully.");
      } else {
        const errorText =
          (await response.json()).detail || "Failed to retrieve the file.";
        setErrorMessage(errorText);
      }
    } catch (error) {
      console.error("Error retrieving file:", error);
      setErrorMessage(
        "Error retrieving file. Please check the console for more details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="max-w-sm w-full">
        <form onSubmit={handleRetrieveFile}>
          <CardHeader>
            <div>Retrieve File</div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="space-y-2 relative">
                <Label htmlFor="search">File Name</Label>
                <div className="flex relative items-center">
                  <Input
                    id="search"
                    type="text"
                    placeholder="Enter file name..."
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="pl-3 pr-10 py-2 w-full"
                  />
                  {isLoading && (
                    <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-3">
                      <LoadingSpinner className="h-5 w-5 text-blue-500" />
                    </div>
                  )}
                </div>
              </div>
              {errorMessage && <Error message={errorMessage} />}
              {successMessage && <Success message={successMessage} />}
              <Button type="submit">Retrieve File</Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
