// hooks/useFileDelete.js

import { useCallback } from "react";
import { useAuth } from "@/components/auth/AuthContext";

const useFileDelete = (fetchFiles) => {
  //fetch token
  const { getToken } = useAuth();
  const token = getToken();

  // This hook uses useCallback to memoize the function, avoiding unnecessary re-creations
  const handleFileDelete = useCallback(
    async (filename, extension) => {
      if (
        !confirm(`Are you sure you want to delete ${filename}.${extension}?`)
      ) {
        return;
      }

      // Retrieve the base API URL from environment variables
      const BASE_URL = import.meta.env.VITE_APP_API_URL;

      try {
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
