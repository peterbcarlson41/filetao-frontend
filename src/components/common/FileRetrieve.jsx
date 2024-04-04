import React, { useState, useContext } from "react";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/Spinner";

export default function Retrieve() {
  const [filename, setFilename] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const handleRetrieveFile = async (e) => {
    e.preventDefault();
    if (!filename.trim()) {
      alert("Filename cannot be empty.");
      return;
    }

    setIsLoading(true); // Start loading
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
      } else {
        alert(
          "Failed to retrieve the file. Please check the filename and try again."
        );
      }
    } catch (error) {
      console.error("Error retrieving file:", error);
      alert(
        "Error retrieving file. Please check the console for more details."
      );
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
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
                    className="pl-3 pr-10 py-2 w-full" // Adjust padding and styles as needed
                  />
                  {isLoading && (
                    // Absolute position the spinner in the center of the input
                    <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-3">
                      <LoadingSpinner className="h-5 w-5 text-blue-500" />
                    </div>
                  )}
                </div>
              </div>
              <Button type="submit">Retrieve File</Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
