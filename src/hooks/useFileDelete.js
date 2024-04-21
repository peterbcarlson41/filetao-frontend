// hooks/useFileDelete.js

import { useCallback } from "react";

const useFileDelete = (fetchFiles) => {
  // This hook uses useCallback to memoize the function, avoiding unnecessary re-creations
  const handleFileDelete = useCallback(
    async (filename, extension) => {
      if (!confirm("Are you sure you want to delete this file?")) {
        return; // Early exit if the user cancels the confirmation
      }

      // Retrieve the base API URL from environment variables
      const BASE_URL = import.meta.env.VITE_APP_API_URL;

      try {
        const token = localStorage.getItem("token");
        const fullFilename = `${filename}.${extension}`;
        const url = `${BASE_URL}/delete/${encodeURIComponent(fullFilename)}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          alert("File deleted successfully.");
          fetchFiles();
        } else {
          alert("Failed to delete the file.");
        }
      } catch (error) {
        console.error("Error deleting file:", error);
        alert("An error occurred while deleting the file.");
      }
    },
    [fetchFiles]
  );

  return handleFileDelete;
};

export default useFileDelete;
